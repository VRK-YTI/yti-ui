import { useGetAuthenticatedUserQuery } from '@app/common/components/login/login.slice';
import { useCallback, useEffect, useState } from 'react';
import {
  Button,
  IconPlus,
  InlineAlert,
  Modal,
  ModalContent,
  ModalFooter,
  ModalTitle,
} from 'suomifi-ui-components';
import { useBreakpoints } from 'yti-common-ui/components/media-query';
import { FormErrors, validateCrosswalkForm } from './validate-crosswalk-form';
import FormFooterAlert from 'yti-common-ui/components/form-footer-alert';
import { translateFileUploadError } from '@app/common/utils/translation-helpers';
import { useTranslation } from 'next-i18next';
import generateCrosswalkPayload from './generate-crosswalk-payload';
import getApiError from '@app/common/utils/getApiErrors';
import { useRouter } from 'next/router';
import HasPermission from '@app/common/utils/has-permission';
import { useInitialCrosswalkForm } from '@app/common/utils/hooks/use-initial-crosswalk-form';
import {
  usePutCrosswalkFullMutation,
  usePutCrosswalkMutation,
} from '@app/common/components/crosswalk/crosswalk.slice';
import CrosswalkForm from './crosswalk-form-fields';
import getErrors from '@app/common/utils/get-errors';
import FileDropAreaMscr from '@app/common/components/file-drop-area-mscr';
import {fileExtensionsAvailableForCrosswalkRegistrationAttachments} from "@app/common/interfaces/format.interface";

interface CrosswalkFormModalProps {
  refetch: () => void;
  createNew?: boolean;
  groupContent: boolean;
  pid?:string
}

// For the time being, using as schema metadata form, Need to update the props accordingly

export default function CrosswalkFormModal({
  refetch,
  createNew = false,
  groupContent,
  pid
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
  const { data: authenticatedUser } = useGetAuthenticatedUserQuery(undefined, {
    skip,
  });
  const [putCrosswalkFull, registerCrosswalkResult] =
    usePutCrosswalkFullMutation();
  const [putCrosswalk, newCrosswalkResult] = usePutCrosswalkMutation();
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
    const result = createNew ? newCrosswalkResult : registerCrosswalkResult;
    if (userPosted && result.isSuccess) {
      refetch();
      handleClose();
      router.push(`/crosswalk/${result.data.pid}`);
    }
  }, [
    registerCrosswalkResult,
    refetch,
    userPosted,
    handleClose,
    router,
    createNew,
    newCrosswalkResult,
  ]);

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

    const payload = generateCrosswalkPayload(formData,
      groupContent,
      pid,
      authenticatedUser);
    console.log('payload: ', payload);
    if (!createNew && fileData) {
      const crosswalkFormData = new FormData();
      crosswalkFormData.append('metadata', JSON.stringify(payload));
      crosswalkFormData.append('file', fileData);
      console.log(crosswalkFormData);
      putCrosswalkFull(crosswalkFormData);
    } else if (createNew) {
      putCrosswalk(payload);
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

 
  function gatherErrorMessages() {
    const inputErrors = getErrors(t, errors);
    const result = createNew ? newCrosswalkResult : registerCrosswalkResult;
    if (result.isError) {
      const errorMessage = getApiError(result.error);
      return [...inputErrors, errorMessage];
    }
    return inputErrors;
  }

  function renderButton() {
    return (
      <Button
      variant="secondary"
      icon={<IconPlus />}
      style={{ height: 'min-content' }}
      onClick={() => handleOpen()}
    >
      {createNew ? t('crosswalk-form.create') : t('crosswalk-form.register')}
    </Button>
    )
  }

  return (
    <>
       {groupContent && HasPermission({ actions: ['CREATE_CROSSWALK'],targetOrganization:pid }) ? (
        <div>
          {renderButton()}
        </div>
      ) : (
          !groupContent ? (
            <div>
              {renderButton()}
            </div>
        ) : (
              <div></div>
        ))}
      <Modal
        appElementId="__next"
        visible={visible}
        onEscKeyDown={() => handleClose()}
        variant={isSmall ? 'smallScreen' : 'default'}
      >
        <ModalContent>
          <ModalTitle>
            {
              createNew
                ? t('crosswalk-form.createTitle')
                : t('crosswalk-form.registerTitle') /*'Add New Crosswalk'*/
            }
          </ModalTitle>
          {/*<Paragraph style={{ marginBottom: '30px' }}>*/}
          {/*  {'Add New Crosswalk Description'}*/}
          {/*</Paragraph>*/}
          <CrosswalkForm
            formData={formData}
            setFormData={setFormData}
            createNew={createNew}
            userPosted={userPosted}
            disabled={authenticatedUser && authenticatedUser.anonymous}
            errors={userPosted ? errors : undefined}
          />
          {!createNew && (
            <FileDropAreaMscr
              setFileData={setFileData}
              setIsValid={setIsValid}
              validFileTypes={fileExtensionsAvailableForCrosswalkRegistrationAttachments}
              translateFileUploadError={translateFileUploadError}
            />
          )}
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

          <Button onClick={() => handleSubmit()}>
            {createNew
              ? t('crosswalk-form.create')
              : t('crosswalk-form.register')}
            {/*'Create Crosswalk'*/}
          </Button>
          <Button variant="secondary" onClick={() => handleClose()}>
            {t('cancel')}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
