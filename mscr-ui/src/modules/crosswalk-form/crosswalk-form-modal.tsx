import { useGetAuthenticatedUserMutMutation } from '@app/common/components/login/login.slice';
import { useCallback, useEffect, useState } from 'react';
import {
  Button,
  InlineAlert,
  Modal,
  ModalContent,
  ModalFooter,
  ModalTitle,
  Paragraph,
} from 'suomifi-ui-components';
import { useBreakpoints } from 'yti-common-ui/media-query';
import { FormErrors, validateForm } from './validate-form';
import FormFooterAlert from 'yti-common-ui/form-footer-alert';
import {
  translateLanguage,
  translateModelFormErrors,
} from '@app/common/utils/translation-helpers';
import { useTranslation } from 'next-i18next';
import generatePayload from './generate-payload';
import getApiError from '@app/common/utils/getApiErrors';
import { useRouter } from 'next/router';
import HasPermission from '@app/common/utils/has-permission';
import { useInitialCrosswalkForm } from '@app/common/utils/hooks/use-initial-crosswalk-form';
import { usePutCrosswalkMutation } from '@app/common/components/crosswalk/crosswalk.slice';
import CrosswalkForm from '.';

interface CrosswalkFormModalProps {
  refetch: () => void;
}

// For the time being, using as schema metadata form, Need to update the props accordingly

export default function CrosswalkFormModal({
  refetch,
}: CrosswalkFormModalProps) {
  const { t } = useTranslation('admin');
  const { isSmall } = useBreakpoints();
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [crosswalkFormInitialData] = useState(useInitialCrosswalkForm());
  const [formData, setFormData] = useState(crosswalkFormInitialData);
  const [errors, setErrors] = useState<FormErrors>();
  const [userPosted, setUserPosted] = useState(false);
  const [getAuthenticatedUser, authenticateUser] =
    useGetAuthenticatedUserMutMutation();
  const [putCrosswalk, result] = usePutCrosswalkMutation();

  const handleOpen = () => {
    setVisible(true);
    getAuthenticatedUser();
  };

  const handleClose = useCallback(() => {
    setVisible(false);
    setUserPosted(false);
    setFormData(crosswalkFormInitialData);
  }, [crosswalkFormInitialData]);

  useEffect(() => {
    if (userPosted && result.isSuccess) {
      refetch();
      handleClose();
      //router.push(`/crosswalk/${result.data.pid}`);
      alert('Crosswalk created Successfully');
    }
  }, [result, refetch, userPosted, handleClose, router]);

  const handleSubmit = () => {
    setUserPosted(true);
    if (!formData) {
      return;
    }

    const errors = validateForm(formData);
    setErrors(errors);

    if (Object.values(errors).includes(true)) {
      return;
    }

    const payload = generatePayload(formData);
    console.log(payload);
    putCrosswalk(payload);
  };

  useEffect(() => {
    if (!userPosted) {
      return;
    }

    const errors = validateForm(formData);
    setErrors(errors);
  }, [userPosted, formData]);

  if (!HasPermission({ actions: ['CREATE_CROSSWALK'] })) {
    return null;
  }

  return (
    <>
      <Button
        icon="plus"
        style={{ height: 'min-content' }}
        onClick={() => handleOpen()}
      >
        {'Register Crosswalk'}
      </Button>

      <Modal
        appElementId="__next"
        visible={visible}
        onEscKeyDown={() => handleClose()}
        variant={isSmall ? 'smallScreen' : 'default'}
      >
        <ModalContent>
          <ModalTitle>{'Add New Crosswalk'}</ModalTitle>
          <Paragraph style={{ marginBottom: '30px' }}>
            {'Add New Crosswalk Description'}
          </Paragraph>
          <CrosswalkForm
            formData={formData}
            setFormData={setFormData}
            userPosted={userPosted}
            disabled={authenticateUser.data && authenticateUser.data.anonymous}
            errors={userPosted ? errors : undefined}
          />
        </ModalContent>
        <ModalFooter>
          {authenticateUser.data && authenticateUser.data.anonymous && (
            <InlineAlert status="error" role="alert" id="unauthenticated-alert">
              {t('error-unauthenticated')}
            </InlineAlert>
          )}
          {userPosted && (
            <FormFooterAlert
              labelText={t('missing-information-title')}
              alerts={getErrors(errors)}
            />
          )}

          <Button onClick={() => handleSubmit()}>{'Create Crosswalk'}</Button>
          <Button variant="secondary" onClick={() => handleClose()}>
            {t('cancel')}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );

  function getErrors(errors?: FormErrors): string[] | undefined {
    if (!errors) {
      return [];
    }

    const langsWithError = Object.entries(errors)
      .filter(([_, value]) => Array.isArray(value))
      ?.flatMap(([key, value]) =>
        (value as string[]).map(
          (lang) =>
            `${translateModelFormErrors(key, t)} ${translateLanguage(lang, t)}`
        )
      );

    const otherErrors = Object.entries(errors)
      .filter(([_, value]) => value && !Array.isArray(value))
      ?.map(([key, _]) => translateModelFormErrors(key, t));

    if (result.isError) {
      const errorMessage = getApiError(result.error);
      return [...langsWithError, ...otherErrors, errorMessage];
    }

    return [...langsWithError, ...otherErrors];
  }
}
