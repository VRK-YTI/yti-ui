import { useGetAuthenticatedUserMutMutation } from '@app/common/components/login/login.slice';
import { useCallback, useEffect, useState } from 'react';
import {
  Button,
  IconPlus,
  InlineAlert,
  Modal,
  ModalContent,
  ModalFooter,
  ModalTitle,
  Paragraph,
} from 'suomifi-ui-components';
import { useBreakpoints } from 'yti-common-ui/media-query';
import SaveSpinner from 'yti-common-ui/save-spinner';
import ModelForm from '.';
import { FormErrors, validateForm } from './validate-form';
import { useInitialModelForm } from '@app/common/utils/hooks/use-initial-model-form';
import FormFooterAlert from 'yti-common-ui/form-footer-alert';
import {
  translateLanguage,
  translateModelFormErrors,
} from '@app/common/utils/translation-helpers';
import { useTranslation } from 'next-i18next';
import generatePayload from './generate-payload';
import { useCreateModelMutation } from '@app/common/components/model/model.slice';
import getApiError from '@app/common/utils/get-api-errors';
import { useRouter } from 'next/router';
import HasPermission from '@app/common/utils/has-permission';
import { FooterBlock } from './model-form.styles';

export default function ModelFormModal() {
  const { t } = useTranslation('admin');
  const { isSmall } = useBreakpoints();
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [modelFormInitialData] = useState(useInitialModelForm());
  const [formData, setFormData] = useState(modelFormInitialData);
  const [errors, setErrors] = useState<FormErrors>();
  const [userPosted, setUserPosted] = useState(false);
  const [getAuthenticatedUser, authenticatedUser] =
    useGetAuthenticatedUserMutMutation();
  const [createModel, result] = useCreateModelMutation();

  const handleOpen = () => {
    setVisible(true);
    getAuthenticatedUser();
  };

  const handleClose = useCallback(() => {
    setVisible(false);
    setUserPosted(false);
    setFormData(modelFormInitialData);
  }, [modelFormInitialData]);

  useEffect(() => {
    if (userPosted && result.isSuccess) {
      router.push(`/model/${formData.prefix}?new=true`);
      handleClose();
    }
  }, [result, userPosted, handleClose, router, formData.prefix]);

  const handleSubmit = () => {
    setUserPosted(true);
    if (!formData) {
      return;
    }

    const errors = validateForm(formData);
    setErrors(errors);

    if (Object.values(errors).includes(true) || errors.titleAmount.length > 0) {
      return;
    }

    const payload = generatePayload(formData);

    createModel(payload);
  };

  useEffect(() => {
    if (!userPosted) {
      return;
    }

    const errors = validateForm(formData);
    setErrors(errors);
  }, [userPosted, formData]);

  if (!HasPermission({ actions: ['CREATE_DATA_MODEL'] })) {
    return null;
  }

  return (
    <>
      <Button
        icon={<IconPlus />}
        style={{ height: 'min-content' }}
        onClick={() => handleOpen()}
        id="new-model-button"
      >
        {t('add-new-model')}
      </Button>

      <Modal
        appElementId="__next"
        visible={visible}
        onEscKeyDown={() => handleClose()}
        variant={isSmall ? 'smallScreen' : 'default'}
      >
        <ModalContent>
          <ModalTitle>{t('add-new-model')}</ModalTitle>
          <Paragraph style={{ marginBottom: '30px' }}>
            {t('add-new-model-description')}
          </Paragraph>
          <ModelForm
            formData={formData}
            setFormData={setFormData}
            userPosted={userPosted}
            disabled={
              authenticatedUser.data && authenticatedUser.data.anonymous
            }
            errors={userPosted ? errors : undefined}
          />
        </ModalContent>
        <ModalFooter>
          {authenticatedUser.data && authenticatedUser.data.anonymous && (
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
          <FooterBlock>
            <Button
              disabled={userPosted && !errors}
              onClick={() => handleSubmit()}
              id="submit-button"
            >
              {t('create-model')}
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleClose()}
              id="cancel-button"
            >
              {t('cancel')}
            </Button>
            {userPosted && !errors && (
              <SaveSpinner text={t('creating-model')} />
            )}
          </FooterBlock>
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
      return [...langsWithError, ...otherErrors, ...errorMessage];
    }

    return [...langsWithError, ...otherErrors];
  }
}
