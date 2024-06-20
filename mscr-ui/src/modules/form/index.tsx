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
import {
  usePutSchemaFullMutation,
  usePutSchemaMscrCopyMutation,
  usePutSchemaRevisionMutation,
} from '@app/common/components/schema/schema.slice';
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
import { Schema } from '@app/common/interfaces/schema.interface';
import { mscrSearchApi } from '@app/common/components/mscr-search/mscr-search.slice';
import { useStoreDispatch } from '@app/store';
import SchemaFormFields from '@app/modules/form/schema-form/schema-form-fields';
import { Crosswalk } from '@app/common/interfaces/crosswalk.interface';
import { Type } from '@app/common/interfaces/search.interface';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import { State } from '@app/common/interfaces/state.interface';
import {
  usePutCrosswalkFullMutation,
  usePutCrosswalkFullRevisionMutation,
  usePutCrosswalkMutation,
  usePutCrosswalkRevisionMutation,
} from '@app/common/components/crosswalk/crosswalk.slice';
import CrosswalkForm from '@app/modules/form/crosswalk-form/crosswalk-form-fields';
import { setNotification } from '@app/common/components/notifications/notifications.slice';
import {
  FormType,
  useInitialForm,
} from '@app/common/utils/hooks/use-initial-form';
import { NotificationKeys } from '@app/common/interfaces/notifications.interface';
import { InputErrors, validateForm } from '@app/modules/form/validate-form';
import generatePayload from '@app/modules/form/generate-payload';

export enum ModalType {
  RegisterNewFull = 'REGISTER_NEW_FULL',
  RegisterNewMscr = 'REGISTER_NEW_MSCR',
  RevisionFull = 'REVISION_FULL',
  RevisionMscr = 'REVISION_MSCR',
  McsrCopy = 'MSCR_COPY',
}

interface FormModalProps {
  modalType: ModalType;
  contentType: Type;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  initialData?: Schema | Crosswalk;
  organizationPid?: string;
}

export default function FormModal({
  modalType,
  contentType,
  visible,
  setVisible,
  initialData,
  organizationPid,
}: FormModalProps) {
  const { t } = useTranslation('common');
  const { isSmall } = useBreakpoints();
  const router = useRouter();
  const lang = router.locale ?? '';
  const dispatch = useStoreDispatch();
  const emptyForm = useInitialForm(contentType);
  const [formData, setFormData] = useState({ ...emptyForm });
  const [fileData, setFileData] = useState<File | null>();
  const [fileUri, setFileUri] = useState<string | null>();
  const [errors, setErrors] = useState<InputErrors>();
  const { data: authenticatedUser } = useGetAuthenticatedUserQuery();
  const [userPosted, setUserPosted] = useState(false);

  const [putSchemaFull, resultSchemaFull] = usePutSchemaFullMutation();
  const [putCrosswalk, resultCrosswalk] = usePutCrosswalkMutation();
  const [putCrosswalkFull, resultCrosswalkFull] = usePutCrosswalkFullMutation();
  const [putSchemaRevision, resultSchemaRevision] =
    usePutSchemaRevisionMutation();
  const [putCrosswalkRevision, resultCrosswalkRevision] =
    usePutCrosswalkRevisionMutation();
  const [putCrosswalkFullRevision, resultCrosswalkFullRevision] =
    usePutCrosswalkFullRevisionMutation();
  const [putSchemaMscrCopy, resultSchemaMscrCopy] =
    usePutSchemaMscrCopyMutation();
  const [submitAnimationVisible, setSubmitAnimationVisible] =
    useState<boolean>(false);

  const formDataFromInitialData = useCallback(() => {
    if (!initialData) return;
    const existingData: FormType = {
      format:
        modalType == ModalType.McsrCopy ? Format.Mscr : initialData.format,
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
      contentType == Type.Crosswalk &&
      'sourceSchema' in initialData &&
      'targetSchema' in initialData
    ) {
      existingData.sourceSchema = initialData.sourceSchema ?? '';
      existingData.targetSchema = initialData.targetSchema ?? '';
    }
    return existingData;
  }, [contentType, initialData, lang, modalType, t]);

  useEffect(() => {
    if (
      modalType == ModalType.RegisterNewMscr ||
      modalType == ModalType.RegisterNewFull
    ) {
      return;
    }
    const formDataFromExisting = formDataFromInitialData();
    if (formDataFromExisting) setFormData({ ...formDataFromExisting });
  }, [formDataFromInitialData, modalType, initialData, visible]);

  const handleClose = useCallback(() => {
    setVisible(false);
    setUserPosted(false);
    setFormData(emptyForm);
    setFileData(null);
    setFileUri(null);
  }, [setVisible, emptyForm]);

  const getNewPidFromApi = useCallback(
    (contentType: Type, modalType: ModalType) => {
      let pid;
      switch (modalType) {
        case ModalType.RegisterNewMscr:
          if (
            contentType == Type.Crosswalk &&
            resultCrosswalk.isSuccess &&
            resultCrosswalk.data
          ) {
            pid = resultCrosswalk.data.pid;
          }
          break;
        case ModalType.RegisterNewFull:
          if (
            contentType == Type.Crosswalk &&
            resultCrosswalkFull.isSuccess &&
            resultCrosswalkFull.data
          ) {
            pid = resultCrosswalkFull.data.pid;
          } else if (
            contentType == Type.Schema &&
            resultSchemaFull.isSuccess &&
            resultSchemaFull.data
          ) {
            pid = resultSchemaFull.data.pid;
          }
          break;
        case ModalType.RevisionMscr:
          if (
            contentType == Type.Crosswalk &&
            resultCrosswalkRevision.isSuccess &&
            resultCrosswalkRevision.data
          ) {
            pid = resultCrosswalkRevision.data.pid;
          }
          break;
        case ModalType.RevisionFull:
          if (
            contentType == Type.Crosswalk &&
            resultCrosswalkFullRevision.isSuccess &&
            resultCrosswalkFullRevision.data
          ) {
            pid = resultCrosswalkFullRevision.data.pid;
          } else if (
            contentType == Type.Schema &&
            resultSchemaRevision.isSuccess &&
            resultSchemaRevision.data
          ) {
            pid = resultSchemaRevision.data.pid;
          }
          break;
        case ModalType.McsrCopy:
          if (
            contentType == Type.Schema &&
            resultSchemaMscrCopy.isSuccess &&
            resultSchemaMscrCopy.data
          ) {
            pid = resultSchemaMscrCopy.data.pid;
          }
          break;
        // TODO: MscrCopy API slice and then pid retrieval for crosswalk here
      }
      return pid;
    },
    [
      resultCrosswalk.data,
      resultCrosswalk.isSuccess,
      resultCrosswalkFull.data,
      resultCrosswalkFull.isSuccess,
      resultCrosswalkFullRevision.data,
      resultCrosswalkFullRevision.isSuccess,
      resultCrosswalkRevision.data,
      resultCrosswalkRevision.isSuccess,
      resultSchemaFull.data,
      resultSchemaFull.isSuccess,
      resultSchemaMscrCopy.data,
      resultSchemaMscrCopy.isSuccess,
      resultSchemaRevision.data,
      resultSchemaRevision.isSuccess,
    ]
  );

  useEffect(() => {
    const newPid = getNewPidFromApi(contentType, modalType);
    if (userPosted && newPid && !submitAnimationVisible) {
      dispatch(
        mscrSearchApi.util.invalidateTags([
          'PersonalContent',
          'OrgContent',
          'MscrSearch',
        ])
      );
      handleClose();
      let notificationKey: NotificationKeys;
      if (contentType == Type.Schema) {
        router.push(`/schema/${newPid}`);
        switch (modalType) {
          case ModalType.RegisterNewFull:
          case ModalType.RegisterNewMscr:
            notificationKey = 'SCHEMA_ADD';
            break;
          case ModalType.RevisionFull:
          case ModalType.RevisionMscr:
            notificationKey = 'SCHEMA_REVISION';
            break;
          case ModalType.McsrCopy:
            notificationKey = 'SCHEMA_COPY';
        }
      } else {
        router.push(`/crosswalk/${newPid}`);
        switch (modalType) {
          case ModalType.RegisterNewFull:
          case ModalType.RegisterNewMscr:
            notificationKey = 'CROSSWALK_ADD';
            break;
          case ModalType.RevisionFull:
          case ModalType.RevisionMscr:
            notificationKey = 'CROSSWALK_REVISION';
            break;
          case ModalType.McsrCopy:
            notificationKey = 'CROSSWALK_COPY';
        }
      }
      dispatch(setNotification(notificationKey));
    }
  }, [
    userPosted,
    submitAnimationVisible,
    getNewPidFromApi,
    contentType,
    modalType,
    dispatch,
    handleClose,
    router,
  ]);

  const spinnerDelay = async () => {
    setSubmitAnimationVisible(true);
    if (!(errors && Object.values(errors).includes(true))) {
      await delay(2000);
    }
    return Promise.resolve();
  };

  const handleSubmit = () => {
    scrollToModalTop();
    setUserPosted(true);
    if (!formData) {
      return;
    }
    const formErrors = validateForm(
      formData,
      contentType,
      modalType,
      fileData,
      fileUri
    );
    setErrors(formErrors);

    if (
      formErrors &&
      (Object.values(formErrors).includes(true) ||
        formErrors.titleAmount.length > 0)
    ) {
      return;
    }

    if (authenticatedUser) {
      const payload = generatePayload(
        formData,
        contentType,
        authenticatedUser,
        modalType,
        organizationPid
      );
      const newFormData = new FormData();
      newFormData.append('metadata', JSON.stringify(payload));
      if (fileUri && fileUri.length > 0) {
        newFormData.append('contentURL', fileUri);
      } else if (fileData) {
        newFormData.append('file', fileData);
      } else if (formData.format !== Format.Mscr) {
        return;
      }

      // Choose the api call and parameters according to content type and modal type
      let makeApiCall;
      if (modalType == ModalType.RegisterNewFull) {
        makeApiCall =
          contentType == Type.Schema ? putSchemaFull : putCrosswalkFull;
        Promise.all([spinnerDelay(), makeApiCall(newFormData)]).then(
          (_values) => {
            setSubmitAnimationVisible(false);
          }
        );
      } else if (modalType == ModalType.RegisterNewMscr) {
        Promise.all([spinnerDelay(), putCrosswalk(payload)]).then((_values) => {
          setSubmitAnimationVisible(false);
        });
      } else if (initialData && modalType == ModalType.RevisionFull) {
        makeApiCall =
          contentType == Type.Schema
            ? putSchemaRevision
            : putCrosswalkFullRevision;
        Promise.all([
          spinnerDelay(),
          makeApiCall({ pid: initialData.pid, data: newFormData }),
        ]).then((_values) => {
          setSubmitAnimationVisible(false);
        });
      } else if (
        initialData &&
        modalType == ModalType.McsrCopy &&
        contentType == Type.Schema
      ) {
        Promise.all([
          spinnerDelay(),
          putSchemaMscrCopy({ pid: initialData.pid, data: payload }),
        ]).then((_values) => {
          setSubmitAnimationVisible(false);
        });
      } else if (
        initialData &&
        modalType == ModalType.RevisionMscr &&
        contentType == Type.Crosswalk
      ) {
        Promise.all([
          spinnerDelay(),
          putCrosswalkRevision({ pid: initialData.pid, data: payload }),
        ]).then((_values) => {
          setSubmitAnimationVisible(false);
        });
      }
      // Missing scenarios: MSCR copy of a crosswalk, revision of an MSCR copy
    }
  };

  // Continuously updating validation after submitting
  useEffect(() => {
    if (!userPosted || !formData) {
      return;
    }
    const formErrors = validateForm(
      formData,
      contentType,
      modalType,
      fileData,
      fileUri
    );
    setErrors(formErrors);
  }, [userPosted, formData, fileData, fileUri, contentType, modalType]);

  function gatherInputError() {
    return getErrors(t, errors);
  }

  function gatherApiError() {
    let errorObject;
    if (resultSchemaRevision.isError) {
      errorObject = getApiError(resultSchemaRevision.error);
    } else if (resultCrosswalkRevision.isError) {
      errorObject = getApiError(resultCrosswalkRevision.error);
    } else if (resultCrosswalkFullRevision.isError) {
      errorObject = getApiError(resultCrosswalkFullRevision.error);
    } else if (resultCrosswalk.isError) {
      errorObject = getApiError(resultCrosswalk.error);
    } else if (resultCrosswalkFull.isError) {
      errorObject = getApiError(resultCrosswalkFull.error);
    } else if (resultSchemaFull.isError) {
      errorObject = getApiError(resultSchemaFull.error);
    } else if (resultSchemaMscrCopy.isError) {
      errorObject = getApiError(resultSchemaMscrCopy.error);
    } else {
      return undefined;
    }
    return errorObject;
  }

  function renderErrorAlerts() {
    const inputErrors = gatherInputError();
    const errorObject = gatherApiError();
    let errorMessage;
    let errorDetail;
    if (errorObject && errorObject.status && errorObject.message) {
      errorMessage = `${errorObject.status}: ${errorObject.message}`;
    }
    if (errorObject && errorObject.detail) {
      errorDetail = errorObject.detail;
    }
    return (
      <>
        {authenticatedUser &&
          authenticatedUser.anonymous &&
          !submitAnimationVisible && (
            <InlineAlert status="error" role="alert" id="unauthenticated-alert">
              {t('error-unauthenticated')}
            </InlineAlert>
          )}
        {userPosted && inputErrors && !submitAnimationVisible && (
          <>
            <FormFooterAlert
              labelText={'Something went wrong'}
              alerts={inputErrors}
            />
          </>
        )}
        {/*Showing API Error if only input form error is not present*/}
        {userPosted &&
          inputErrors.length < 1 &&
          errorObject &&
          !submitAnimationVisible && (
            <div>
              <InlineAlert status="error">{errorMessage}</InlineAlert>
              <InlineAlert>{errorDetail}</InlineAlert>
            </div>
          )}
      </>
    );
  }

  function scrollToModalTop() {
    const modalTop = document.getElementById('modalTop');
    if (modalTop) {
      modalTop.scrollIntoView();
    }
  }

  function renderFileDropArea() {
    const fileExtensions =
      contentType == Type.Schema
        ? fileExtensionsAvailableForSchemaRegistration
        : fileExtensionsAvailableForCrosswalkRegistrationAttachments;
    const required =
      contentType == Type.Schema
        ? t('schema-form.file-required')
        : t('crosswalk-form.file-required');
    const fileFormats =
      contentType == Type.Schema
        ? t('schema-form.supported-file-formats')
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
          setIsValid={() => {
            return;
          }}
          validFileTypes={fileExtensions}
          translateFileUploadError={translateFileUploadError}
          isSchemaUpload={contentType == Type.Schema}
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
              type={
                // Picking the right scaling breakpoints for the spinner
                // Todo: differentiate crosswalk revision with and without file upload
                // Todo: mscr copy type
                contentType == Type.Schema
                  ? modalType == ModalType.RegisterNewFull
                    ? SpinnerType.SchemaRegistrationModal
                    : SpinnerType.SchemaRevisionModal
                  : modalType == ModalType.RegisterNewFull
                    ? SpinnerType.CrosswalkRegistrationModal
                    : modalType == ModalType.RegisterNewMscr
                      ? SpinnerType.CrosswalkCreationModal
                      : SpinnerType.CrosswalkRevisionModal
              }
            ></SpinnerOverlay>
          )}
        </>
        <div id={'modalTop'}></div>
        <ModalTitle>
          {contentType == Type.Schema
            ? modalType == ModalType.RegisterNewFull
              ? t('content-form.title.schema-register')
              : modalType == ModalType.McsrCopy
                ? t('content-form.title.schema-mscr-copy')
                : t('content-form.title.schema-revision')
            : modalType == ModalType.RegisterNewFull
              ? t('content-form.title.crosswalk-register')
              : modalType == ModalType.RegisterNewMscr
                ? t('content-form.title.crosswalk-create')
                : modalType == ModalType.McsrCopy
                  ? t('content-form.title.crosswalk-mscr-copy')
                  : t('content-form.title.crosswalk-revision')}
        </ModalTitle>

        {(modalType == ModalType.RegisterNewFull ||
          modalType == ModalType.RevisionFull) &&
          renderFileDropArea()}

        {contentType == Type.Schema && (
          <SchemaFormFields
            formData={formData}
            setFormData={setFormData}
            userPosted={userPosted}
            disabled={
              (authenticatedUser && authenticatedUser.anonymous) ||
              submitAnimationVisible
            }
            errors={userPosted ? errors : undefined}
            hasInitialData={
              modalType == ModalType.RevisionMscr ||
              modalType == ModalType.RevisionFull ||
              modalType == ModalType.McsrCopy
            }
          />
        )}
        {contentType == Type.Crosswalk && (
          <CrosswalkForm
            formData={formData}
            setFormData={setFormData}
            createNew={modalType == ModalType.RegisterNewMscr}
            hasInitialData={
              modalType == ModalType.RevisionMscr ||
              modalType == ModalType.RevisionFull ||
              modalType == ModalType.McsrCopy
            }
            userPosted={userPosted}
            disabled={
              (authenticatedUser && authenticatedUser.anonymous) ||
              submitAnimationVisible
            }
            errors={userPosted ? errors : undefined}
            groupWorkspacePid={undefined}
          />
        )}
        <Separator></Separator>
      </ModalContent>
      <ModalFooter>
        {renderErrorAlerts()}
        <Button
          disabled={submitAnimationVisible}
          onClick={() => handleSubmit()}
        >
          {contentType == Type.Schema
            ? modalType == ModalType.RegisterNewFull
              ? t('content-form.button.schema-register')
              : modalType == ModalType.McsrCopy
                ? t('content-form.button.mscr-copy')
                : t('content-form.button.schema-revision')
            : modalType == ModalType.RegisterNewFull
              ? t('content-form.button.crosswalk-register')
              : modalType == ModalType.RegisterNewMscr
                ? t('content-form.button.crosswalk-create')
                : modalType == ModalType.McsrCopy
                  ? t('content-form.button.mscr-copy')
                  : t('content-form.button.crosswalk-revision')}
        </Button>
        <Button variant="secondary" onClick={() => handleClose()}>
          {t('cancel')}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
