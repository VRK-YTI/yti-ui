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
import ModelForm from '.';
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
import { useInitialSchemaForm } from '@app/common/utils/hooks/use-initial-schema-form';
import { usePutSchemaMutation } from '@app/common/components/schema/schema.slice';
import SchemaForm from '.';

interface SchemaFormModalProps {
  refetch: () => void;
}

interface SchemaProps {
  pid: string;
}

// For the time being, using as schema metadata form, Need to update the props accordingly

export default function SchemaFormModal({ refetch }: SchemaFormModalProps) {
  const { t } = useTranslation('admin');
  const { isSmall } = useBreakpoints();
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [schemaFormInitialData] = useState(useInitialSchemaForm());
  const [formData, setFormData] = useState(schemaFormInitialData);
  const [errors, setErrors] = useState<FormErrors>();
  const [userPosted, setUserPosted] = useState(false);
  const [getAuthenticatedUser, authenticateUser] =
    useGetAuthenticatedUserMutMutation();
  const [putSchema, result] = usePutSchemaMutation();

  const handleOpen = () => {
    setVisible(true);
    getAuthenticatedUser();
  };

  const handleClose = useCallback(() => {
    setVisible(false);
    setUserPosted(false);
    setFormData(schemaFormInitialData);
  }, [schemaFormInitialData]);

  useEffect(() => {
    if (userPosted && result.isSuccess) {
      //Get the pid from the result
      refetch();
      handleClose();
      // After post route to  saved schema get by PID
      // Later we should show the created schema in the list
      alert('Schema Creation is Successful');
    }
  }, [result, refetch, userPosted, handleClose, router, formData]);

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
    // Here formdata should also contain the file, need modification
    putSchema(payload);
  };

  useEffect(() => {
    if (!userPosted) {
      return;
    }
    const errors = validateForm(formData);
    setErrors(errors);
  }, [userPosted, formData]);

  // Need to add action type create_schema
  if (!HasPermission({ actions: ['CREATE_SCHEMA'] })) {
    return null;
  }

  return (
    <>
      <Button
        icon="plus"
        style={{ height: 'min-content' }}
        onClick={() => handleOpen()}
      >
        {t('add-new-schema')}
      </Button>

      <Modal
        appElementId="__next"
        visible={visible}
        onEscKeyDown={() => handleClose()}
        variant={isSmall ? 'smallScreen' : 'default'}
      >
        <ModalContent>
          <ModalTitle>{t('add-new-schema')}</ModalTitle>
          <Paragraph style={{ marginBottom: '30px' }}>
            {
              'Provide a URI reference to the content in XSD, SKOS or RDF metadata schema format'
            }
          </Paragraph>
          <SchemaForm
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

          <Button onClick={() => handleSubmit()}>{t('create-schema')}</Button>
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
