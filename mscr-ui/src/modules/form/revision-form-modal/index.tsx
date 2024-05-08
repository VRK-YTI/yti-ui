import { useGetAuthenticatedUserQuery } from '@app/common/components/login/login.slice';
import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import {
  Button,
  InlineAlert,
  Modal,
  ModalContent,
  ModalFooter,
  ModalTitle,
  Text,
} from 'suomifi-ui-components';
import { useBreakpoints } from 'yti-common-ui/components/media-query';
import FormFooterAlert from 'yti-common-ui/components/form-footer-alert';
import { translateFileUploadError } from '@app/common/utils/translation-helpers';
import { useTranslation } from 'next-i18next';
import getApiError from '@app/common/utils/getApiErrors';
import { useRouter } from 'next/router';
import { usePutSchemaRevisionMutation } from '@app/common/components/schema/schema.slice';
import Separator from 'yti-common-ui/components/separator';
import getErrors from '@app/common/utils/get-errors';
import {
  fileExtensionsAvailableForCrosswalkRegistrationAttachments,
  fileExtensionsAvailableForSchemaRegistration,
  Format,
} from '@app/common/interfaces/format.interface';
import FileDropAreaMscr from '@app/common/components/file-drop-area-mscr';
import SpinnerOverlay, {
  delay,
  SpinnerType,
} from '@app/common/components/spinner-overlay';
import {
  Schema,
  SchemaFormType,
} from '@app/common/interfaces/schema.interface';
import { mscrSearchApi } from '@app/common/components/mscr-search/mscr-search.slice';
import { useStoreDispatch } from '@app/store';
import {
  FormErrors as SchemaErrors,
  validateSchemaForm,
} from '@app/modules/form/schema-form/validate-schema-form';
import generateSchemaPayload from '@app/modules/form/schema-form/generate-schema-payload';
import SchemaFormFields from '@app/modules/form/schema-form/schema-form-fields';
import {
  Crosswalk,
  CrosswalkFormType,
} from '@app/common/interfaces/crosswalk.interface';
import { Type } from '@app/common/interfaces/search.interface';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import { State } from '@app/common/interfaces/state.interface';
import { useInitialCrosswalkForm } from '@app/common/utils/hooks/use-initial-crosswalk-form';
import {
  usePutCrosswalkFullRevisionMutation,
  usePutCrosswalkRevisionMutation,
} from '@app/common/components/crosswalk/crosswalk.slice';
import {
  FormErrors as CrosswalkErrors,
  validateCrosswalkForm,
} from '@app/modules/form/crosswalk-form/validate-crosswalk-form';
import CrosswalkForm from '@app/modules/form/crosswalk-form/crosswalk-form-fields';
import { Metadata } from '@app/common/interfaces/metadata.interface';

export default function RevisionFormModal({
  initialData,
  visible,
  setVisible,
  type,
}: {
  initialData: Schema | Crosswalk;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  type: Type;
}) {
  const { t } = useTranslation('admin');
  const { isSmall } = useBreakpoints();
  const router = useRouter();
  const lang = router.locale ?? '';
  const dispatch = useStoreDispatch();
  const emptyForm = useInitialCrosswalkForm();
  const [, setIsValid] = useState(false);
  const [formData, setFormData] = useState<
    SchemaFormType | CrosswalkFormType
  >();
  const [fileData, setFileData] = useState<File | null>();
  const [fileUri, setFileUri] = useState<string | null>();
  const [errors, setErrors] = useState<SchemaErrors | CrosswalkErrors>();
  const { data: authenticatedUser } = useGetAuthenticatedUserQuery();
  const [userPosted, setUserPosted] = useState(false);
  // Why are we using a mutation here? Why is that even implemented as a mutation, when the method is GET?
  const [putSchemaRevision, resultSchemaRevision] =
    usePutSchemaRevisionMutation();
  const [putCrosswalkRevision, resultCrosswalkRevision] =
    usePutCrosswalkRevisionMutation();
  const [putCrosswalkFullRevision, resultCrosswalkFullRevision] =
    usePutCrosswalkFullRevisionMutation();
  const [submitAnimationVisible, setSubmitAnimationVisible] =
    useState<boolean>(false);

  const formDataFromInitialData = useCallback(() => {
    const formData: SchemaFormType | CrosswalkFormType = {
      format: initialData.format,
      languages: [
        {
          labelText: t('language-english-with-suffix'),
          uniqueItemId: 'en',
          title:
            initialData.label['en'] ??
            getLanguageVersion({
              data: initialData.label,
              lang: lang,
            }),
          description:
            initialData.description['en'] ??
            getLanguageVersion({
              data: initialData.description,
              lang: lang,
            }),
          selected: true,
        },
      ],
      state: State.Draft,
      versionLabel: initialData.versionLabel,
    };
    if (
      type == Type.Crosswalk &&
      'sourceSchema' in initialData &&
      'targetSchema' in initialData
    ) {
      const crosswalkFormData = formData as CrosswalkFormType;
      crosswalkFormData.sourceSchema = initialData.sourceSchema ?? '';
      crosswalkFormData.targetSchema = initialData.targetSchema ?? '';
      return crosswalkFormData;
    }
    return formData;
  }, [initialData, lang, t, type]);

  useEffect(() => {
    setFormData(formDataFromInitialData());
  }, [formDataFromInitialData, initialData, visible]);

  const handleClose = useCallback(() => {
    setVisible(false);
    setUserPosted(false);
    setFormData(emptyForm);
    setFileData(null);
    setFileUri(null);
  }, [setVisible, emptyForm]);

  useEffect(() => {
    if (
      userPosted &&
      (resultSchemaRevision.isSuccess ||
        resultCrosswalkRevision.isSuccess ||
        resultCrosswalkFullRevision.isSuccess) &&
      !submitAnimationVisible
    ) {
      dispatch(
        mscrSearchApi.util.invalidateTags([
          'PersonalContent',
          'OrgContent',
          'MscrSearch',
        ])
      );
      //Get the pid from the result
      handleClose();
      if (
        resultSchemaRevision &&
        resultSchemaRevision.data &&
        resultSchemaRevision.data.pid
      ) {
        router.push(`/schema/${resultSchemaRevision.data.pid}`);
      } else if (
        resultCrosswalkRevision &&
        resultCrosswalkRevision.data &&
        resultCrosswalkRevision.data.pid
      ) {
        router.push(`/crosswalk/${resultCrosswalkRevision.data.pid}`);
      } else if (
        resultCrosswalkFullRevision &&
        resultCrosswalkFullRevision.data &&
        resultCrosswalkFullRevision.data.pid
      ) {
        router.push(`/crosswalk/${resultCrosswalkFullRevision.data.pid}`);
      }
    }
  }, [
    userPosted,
    handleClose,
    router,
    submitAnimationVisible,
    dispatch,
    resultCrosswalkRevision,
    resultSchemaRevision,
    resultCrosswalkFullRevision,
  ]);

  const spinnerDelay = async () => {
    setSubmitAnimationVisible(true);
    await delay(2000);
    return Promise.resolve();
  };

  const handleSubmit = () => {
    scrollToModalTop();
    setUserPosted(true);
    if (!formData) {
      return;
    }
    let errors;
    if (type == Type.Schema) {
      errors = validateSchemaForm(formData, fileData, fileUri);
      setErrors(errors);
    } else {
      errors = validateCrosswalkForm(formData as CrosswalkFormType);
      setErrors(errors);
    }

    if (Object.values(errors).includes(true)) {
      return;
    }
    const validatedFormData: SchemaFormType = {
      format: formData.format,
      languages: formData.languages,
      versionLabel: formData.versionLabel,
      state: State.Draft,
    };

    if (authenticatedUser) {
      const payload = generateSchemaPayload(
        validatedFormData,
        false,
        undefined,
        undefined,
        true
      ) as Partial<Metadata>;
      const newFormData = new FormData();
      newFormData.append('metadata', JSON.stringify(payload));
      if (fileUri && fileUri.length > 0) {
        newFormData.append('contentURL', fileUri);
      } else if (fileData) {
        newFormData.append('file', fileData);
      } else if (initialData.format !== Format.Mscr) {
        return;
      }

      if (initialData && type == Type.Schema) {
        Promise.all([
          spinnerDelay(),
          putSchemaRevision({ pid: initialData.pid, data: newFormData }),
        ]).then((values) => {
          setSubmitAnimationVisible(false);
        });
      }
      if (initialData && type == Type.Crosswalk) {
        if (initialData.format == Format.Mscr) {
          Promise.all([
            spinnerDelay(),
            putCrosswalkRevision({ pid: initialData.pid, data: payload }),
          ]).then((values) => {
            setSubmitAnimationVisible(false);
          });
        } else {
          Promise.all([
            spinnerDelay(),
            putCrosswalkFullRevision({
              pid: initialData.pid,
              data: newFormData,
            }),
          ]).then((values) => {
            setSubmitAnimationVisible(false);
          });
        }
      }
    }
  };

  useEffect(() => {
    if (!userPosted || !formData) {
      return;
    }
    let errors;
    if (type == Type.Schema) {
      errors = validateSchemaForm(formData, fileData, fileUri);
      setErrors(errors);
    } else {
      errors = validateCrosswalkForm(formData as CrosswalkFormType);
      setErrors(errors);
    }
    //console.log(errors);
  }, [userPosted, formData, fileData, fileUri, type]);

  // This part was checking the user permission and based on that showing the button in every render
  /* if (groupContent && !HasPermission({ actions: ['CREATE_SCHEMA'] })) {
    console.log(HasPermission({actions:['CREATE_SCHEMA']}));
    return null;
  } */

  function gatherInputError() {
    return getErrors(t, errors);
  }

  function gatherApiError() {
    let errorObject;
    let errorMessage = '';
    if (resultSchemaRevision.isError) {
      errorObject = getApiError(resultSchemaRevision.error);
    } else if (resultCrosswalkRevision.isError) {
      errorObject = getApiError(resultCrosswalkRevision.error);
    } else if (resultCrosswalkFullRevision.isError) {
      errorObject = getApiError(resultCrosswalkFullRevision.error);
    } else {
      return;
    }
    if (errorObject.status && errorObject.message) {
      errorMessage = `${errorObject.status}: ${errorObject.message}`;
      return errorMessage;
    }
  }

  function getErrorDetail() {
    let errorObject;
    if (resultSchemaRevision.isError) {
      errorObject = getApiError(resultSchemaRevision.error);
    } else if (resultCrosswalkRevision.isError) {
      errorObject = getApiError(resultCrosswalkRevision.error);
    } else if (resultCrosswalkFullRevision.isError) {
      errorObject = getApiError(resultCrosswalkFullRevision.error);
    } else {
      return;
    }
    if (errorObject.detail) {
      return errorObject.detail;
    }
  }

  function scrollToModalTop() {
    const modalTop = document.getElementById('modalTop');
    if (modalTop) {
      modalTop.scrollIntoView();
    }
  }

  function renderFileDropArea() {
    const fileExtensions =
      type == Type.Schema
        ? fileExtensionsAvailableForSchemaRegistration
        : fileExtensionsAvailableForCrosswalkRegistrationAttachments;
    const required =
      type == Type.Schema
        ? t('register-schema-file-required')
        : t('crosswalk-form.file-required');
    const fileFormats =
      type == Type.Schema
        ? t('register-schema-supported-file-formats')
        : t('crosswalk-form.supported-file-formats');

    return (
      <>
        <Text>{required + ' '}</Text>
        <Text>
          {fileFormats +
            fileExtensions
              .slice(0, fileExtensions.length - 1)
              .join(', ')
              .toUpperCase() +
            ' ' +
            t('and') +
            ' ' +
            fileExtensions
              .slice(fileExtensions.length - 1)
              .toString()
              .toUpperCase() +
            '.'}
        </Text>
        <FileDropAreaMscr
          setFileData={setFileData}
          setIsValid={setIsValid}
          validFileTypes={fileExtensions}
          translateFileUploadError={translateFileUploadError}
          isSchemaUpload={type == Type.Schema}
          setFileUri={setFileUri}
          disabled={submitAnimationVisible}
        />
        <br></br>
      </>
    );
  }

  return (
    <Modal
      appElementId="__next"
      visible={visible}
      onEscKeyDown={() => handleClose()}
      variant={isSmall ? 'smallScreen' : 'default'}
    >
      <ModalContent>
        <>
          {submitAnimationVisible && (
            <SpinnerOverlay
              animationVisible={submitAnimationVisible}
              type={SpinnerType.SchemaRegistrationModal}
            ></SpinnerOverlay>
          )}
        </>
        <div id={'modalTop'}></div>
        <ModalTitle>
          {type == Type.Schema
            ? t('register-schema-revision')
            : t('crosswalk-form.register-revision')}
        </ModalTitle>

        {formData?.format !== Format.Mscr && renderFileDropArea()}

        {type == Type.Schema && (
          <SchemaFormFields
            formData={formData as SchemaFormType}
            setFormData={setFormData}
            userPosted={userPosted}
            disabled={
              (authenticatedUser && authenticatedUser.anonymous) ||
              submitAnimationVisible
            }
            errors={userPosted ? (errors as SchemaErrors) : undefined}
            isRevision={true}
          />
        )}
        {type == Type.Crosswalk && (
          <CrosswalkForm
            formData={formData as CrosswalkFormType}
            setFormData={setFormData}
            createNew={false}
            isRevision={true}
            userPosted={userPosted}
            disabled={
              (authenticatedUser && authenticatedUser.anonymous) ||
              submitAnimationVisible
            }
            errors={userPosted ? errors : undefined}
          />
        )}
        <Separator></Separator>
      </ModalContent>
      <ModalFooter>
        {authenticatedUser &&
          authenticatedUser.anonymous &&
          !submitAnimationVisible && (
            <InlineAlert status="error" role="alert" id="unauthenticated-alert">
              {t('error-unauthenticated')}
            </InlineAlert>
          )}
        {userPosted && gatherInputError() && !submitAnimationVisible && (
          <FormFooterAlert
            labelText={'Something went wrong'}
            alerts={gatherInputError()}
          />
        )}
        {/*Showing API Error if only input form error is not present*/}
        {userPosted &&
          gatherInputError().length < 1 &&
          resultSchemaRevision.error &&
          !submitAnimationVisible && (
            <div>
              <InlineAlert status="error">{gatherApiError()}</InlineAlert>
              <InlineAlert>{getErrorDetail()}</InlineAlert>
            </div>
          )}

        <Button
          disabled={submitAnimationVisible}
          onClick={() => handleSubmit()}
        >
          {type == Type.Schema
            ? t('register-schema-revision')
            : t('crosswalk-form.revision')}
        </Button>
        <Button variant="secondary" onClick={() => handleClose()}>
          {t('cancel')}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
