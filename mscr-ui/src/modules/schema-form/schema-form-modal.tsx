import { useGetAuthenticatedUserMutMutation } from '@app/common/components/login/login.slice';
import { useCallback, useEffect, useState } from 'react';
import {
  Button,
  InlineAlert,
  IconPlus,
  Modal,
  ModalContent,
  ModalFooter,
  ModalTitle,
  Text,
} from 'suomifi-ui-components';
import { useBreakpoints } from 'yti-common-ui/media-query';
import { FormErrors, validateForm } from './validate-form';
import FormFooterAlert from 'yti-common-ui/form-footer-alert';
import {
  translateFileUploadError,
  translateLanguage,
  translateModelFormErrors,
} from '@app/common/utils/translation-helpers';
import { useTranslation } from 'next-i18next';
import generatePayload from './generate-payload';
import getApiError from '@app/common/utils/getApiErrors';
import { useRouter } from 'next/router';
import HasPermission from '@app/common/utils/has-permission';
import { useInitialSchemaForm } from '@app/common/utils/hooks/use-initial-schema-form';
import { usePutSchemaFullMutation } from '@app/common/components/schema/schema.slice';
import SchemaForm from '.';
import FileDropArea from 'yti-common-ui/file-drop-area';
import Separator from 'yti-common-ui/separator';

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
  const [isValid, setIsValid] = useState(false);
  const [schemaFormInitialData] = useState(useInitialSchemaForm());
  const [formData, setFormData] = useState(schemaFormInitialData);
  const [fileData, setFileData] = useState<File | null>();
  const [errors, setErrors] = useState<FormErrors>();
  const [userPosted, setUserPosted] = useState(false);
  const [getAuthenticatedUser, authenticateUser] =
    useGetAuthenticatedUserMutMutation();
  const [putSchemaFull, resultSchemaFull] = usePutSchemaFullMutation();

  const handleOpen = () => {
    setVisible(true);
    getAuthenticatedUser();
  };

  const handleClose = useCallback(() => {
    setVisible(false);
    setUserPosted(false);
    setFormData(schemaFormInitialData);
    setFileData(null);
  }, [schemaFormInitialData]);

  useEffect(() => {
    if (userPosted && resultSchemaFull.isSuccess) {
      //Get the pid from the result
      handleClose();
      if (resultSchemaFull && resultSchemaFull.data.pid) {
        router.push(`/schema/${resultSchemaFull.data.pid}`);
      }

      // After post route to  saved schema get by PID
      // Later we should show the created schema in the list
    }
  }, [resultSchemaFull, refetch, userPosted, handleClose, router, formData]);

  const handleSubmit = () => {
    setUserPosted(true);
    if (!formData) {
      return;
    }
    const errors = validateForm(formData, fileData);
    setErrors(errors);

    if (Object.values(errors).includes(true)) {
      return;
    }

    const payload = generatePayload(formData);

    const schemaFormData = new FormData();
    schemaFormData.append('metadata', JSON.stringify(payload));
    if (fileData) {
      schemaFormData.append('file', fileData);
      putSchemaFull(schemaFormData);
    } else {
      return;
    }
  };

  useEffect(() => {
    if (!userPosted) {
      return;
    }
    const errors = validateForm(formData, fileData);
    setErrors(errors);
    //console.log(errors);
  }, [userPosted, formData]);

  // Need to add action type create_schema
  if (!HasPermission({ actions: ['CREATE_SCHEMA'] })) {
    return null;
  }

  return (
    <>
      <Button
        icon={<IconPlus />}
        style={{ height: 'min-content' }}
        onClick={() => handleOpen()}
      >
        {t('register-schema')}
      </Button>

      <Modal
        appElementId="__next"
        visible={visible}
        onEscKeyDown={() => handleClose()}
        variant={isSmall ? 'smallScreen' : 'default'}
      >
        <ModalContent>
          <ModalTitle>{t('register-schema')}</ModalTitle>
          <SchemaForm
            formData={formData}
            setFormData={setFormData}
            userPosted={userPosted}
            disabled={authenticateUser.data && authenticateUser.data.anonymous}
            errors={userPosted ? errors : undefined}
          />
          <Separator></Separator>
          <Text>
            {
              'Upload a Schema File. You must upload a schema file to register schema'
            }
          </Text>
          <FileDropArea
            setFileData={setFileData}
            setIsValid={setIsValid}
            validFileTypes={['json', 'csv', 'pdf', 'ttl','xml','xsd']}
            translateFileUploadError={translateFileUploadError}
          />
          <Separator isLarge></Separator>
          <Text>
            {
              'All Contents will be registered as draft. You can choose to publish content later'
            }
          </Text>
        </ModalContent>
        <ModalFooter>
          {authenticateUser.data && authenticateUser.data.anonymous && (
            <InlineAlert status="error" role="alert" id="unauthenticated-alert">
              {t('error-unauthenticated')}
            </InlineAlert>
          )}
          {userPosted && (
            <FormFooterAlert
              labelText={'Something went wrong'}
              alerts={getErrors(errors)}
            />
          )}

          <Button onClick={() => handleSubmit()}>{t('register-schema')}</Button>
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

    // console.log(errors);

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

    if (resultSchemaFull.isError) {
      const errorMessage = getApiError(resultSchemaFull.error);
      return [...langsWithError, ...otherErrors, errorMessage];
    }

    return [...langsWithError, ...otherErrors];
  }
}
