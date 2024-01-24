import {
  useGetAuthenticatedUserMutMutation,
  useGetAuthenticatedUserQuery
} from '@app/common/components/login/login.slice';
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
import { useBreakpoints } from 'yti-common-ui/components/media-query';
import { FormErrors, validateCrosswalkForm } from './validate-crosswalk-form';
import FormFooterAlert from 'yti-common-ui/components/form-footer-alert';
import {
  translateFileUploadError,
  translateLanguage,
  translateModelFormErrors,
} from '@app/common/utils/translation-helpers';
import { useTranslation } from 'next-i18next';
import generateCrosswalkPayload from './generate-crosswalk-payload';
import getApiError from '@app/common/utils/getApiErrors';
import { useRouter } from 'next/router';
import HasPermission from '@app/common/utils/has-permission';
import { useInitialCrosswalkForm } from '@app/common/utils/hooks/use-initial-crosswalk-form';
import { usePutCrosswalkFullMutation } from '@app/common/components/crosswalk/crosswalk.slice';
import CrosswalkForm from '../crosswalk-form';
import FileDropArea from 'yti-common-ui/components/file-drop-area';
import getErrors from '@app/common/utils/get-errors';

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
  const [skip, setSkip] = useState(true);
  const { data: authenticatedUser } = useGetAuthenticatedUserQuery(undefined,{ skip });
  const [putCrosswalkFull, result] = usePutCrosswalkFullMutation();
  const [, setIsValid] = useState(false);
  const [fileData, setFileData] = useState<File | null>();

  const handleOpen = () => {
    setSkip(false);
    setVisible(true);
  };

  const handleClose = useCallback(() => {
    setVisible(false);
    setSkip(true);
    setUserPosted(false);
    setFormData(crosswalkFormInitialData);
    setFileData(null);
  }, [crosswalkFormInitialData]);

  useEffect(() => {
    if (userPosted && result.isSuccess) {
      refetch();
      handleClose();
      router.push(`/crosswalk/${result.data.pid}`);
    }
  }, [result, refetch, userPosted, handleClose, router]);

  const handleSubmit = () => {
    setUserPosted(true);
    if (!formData) {
      return;
    }

    const errors = validateCrosswalkForm(formData);
    setErrors(errors);
    if (Object.values(errors).includes(true)) {
      return;
    }

    const payload = generateCrosswalkPayload(formData);
    // console.log(formData);
    const crosswalkFormData = new FormData();
    crosswalkFormData.append('metadata', JSON.stringify(payload));
    if (fileData) {
      crosswalkFormData.append('file', fileData);
      putCrosswalkFull(crosswalkFormData);
    } else {
      return;
    }
  };

  useEffect(() => {
    if (!userPosted) {
      return;
    }

    const errors = validateCrosswalkForm(formData);
    setErrors(errors);
  }, [userPosted, formData]);

  if (!HasPermission({ actions: ['CREATE_CROSSWALK'] })) {
    return null;
  }

  function gatherErrorMessages() {
    const inputErrors = getErrors(t, errors);
    if (result.isError) {
      const errorMessage = getApiError(result.error);
      return [...inputErrors, errorMessage];
    }
    return inputErrors;
  }

  return (
    <>
      <Button
        variant='secondary'
        icon="plus"
        style={{ height: 'min-content' }}
        onClick={() => handleOpen()}
      >
        {t('crosswalk-form.register')}
      </Button>

      <Modal
        appElementId="__next"
        visible={visible}
        onEscKeyDown={() => handleClose()}
        variant={isSmall ? 'smallScreen' : 'default'}
      >
        <ModalContent>
          <ModalTitle>{'Add New Crosswalk'}</ModalTitle>
          {/*<Paragraph style={{ marginBottom: '30px' }}>*/}
          {/*  {'Add New Crosswalk Description'}*/}
          {/*</Paragraph>*/}
          <CrosswalkForm
            formData={formData}
            setFormData={setFormData}
            userPosted={userPosted}
            disabled={authenticatedUser && authenticatedUser.anonymous}
            errors={userPosted ? errors : undefined}
          />
          <FileDropArea
            setFileData={setFileData}
            setIsValid={setIsValid}
            validFileTypes={['csv', 'xslt', 'pdf']}
            translateFileUploadError={translateFileUploadError}
          />
        </ModalContent>
        <ModalFooter>
          {authenticatedUser && authenticatedUser.anonymous && (
            <InlineAlert status="error" role="alert" id="unauthenticated-alert">
              {t('error-unauthenticated')}
            </InlineAlert>
          )}
          {userPosted && (
            <FormFooterAlert
              labelText={'Required Fields are missing'}
              alerts={gatherErrorMessages()}
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
}
