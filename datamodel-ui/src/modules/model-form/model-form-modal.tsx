import {
  selectLogin,
  useGetAuthenticatedUserMutMutation,
} from '@app/common/components/login/login.slice';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
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
import { usePutModelMutation } from '@app/common/components/model/model.slice';
import { SerializedError } from '@reduxjs/toolkit';
import { AxiosBaseQueryError } from 'yti-common-ui/interfaces/axios-base-query.interface';

interface ModelFormModalProps {
  refetch: () => void;
}

export default function ModelFormModal({ refetch }: ModelFormModalProps) {
  const { t } = useTranslation('admin');
  const { isSmall } = useBreakpoints();
  const [visible, setVisible] = useState(false);
  const user = useSelector(selectLogin());
  const [modelFormInitialData] = useState(useInitialModelForm());
  const [formData, setFormData] = useState(modelFormInitialData);
  const [errors, setErrors] = useState<FormErrors>();
  const [userPosted, setUserPosted] = useState(false);
  const [getAuthenticatedUser, authenticateUser] =
    useGetAuthenticatedUserMutMutation();
  const [putModel, result] = usePutModelMutation();

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
      refetch();
      handleClose();
    }
  }, [result, refetch, userPosted, handleClose]);

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

    putModel(payload);
  };

  useEffect(() => {
    if (!userPosted) {
      return;
    }

    const errors = validateForm(formData);
    setErrors(errors);
  }, [userPosted, formData]);

  if (user.anonymous) {
    return null;
  }

  return (
    <>
      <Button
        icon="plus"
        style={{ height: 'min-content' }}
        onClick={() => handleOpen()}
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

          <Button onClick={() => handleSubmit()}>{t('create-model')}</Button>
          <Button variant="secondary" onClick={() => handleClose()}>
            {t('cancel')}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );

  function getApiError(error: AxiosBaseQueryError | SerializedError) {
    let errorStatus = '';
    let errorMessage = '';

    if (
      'data' in error &&
      typeof error.data === 'object' &&
      error.data !== null
    ) {
      if ('status' in error.data && typeof error.data.status === 'string') {
        errorStatus = error.data.status ?? 'GENERAL_ERROR';
      }
      if ('message' in error.data && typeof error.data.message === 'string') {
        errorMessage = error.data.message ?? 'Unexpected error occured';
      }
    } else {
      errorStatus = 'GENERAL_ERROR';
      errorMessage = 'Unexpected error occured';
    }

    return `${errorStatus}: ${errorMessage}`;
  }

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
