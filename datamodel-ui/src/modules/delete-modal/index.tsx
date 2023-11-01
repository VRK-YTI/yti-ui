import { useDeleteClassMutation } from '@app/common/components/class/class.slice';
import { useDeleteModelMutation } from '@app/common/components/model/model.slice';
import { useDeleteResourceMutation } from '@app/common/components/resource/resource.slice';
import {
  translateDeleteModalDescription,
  translateDeleteModalError,
  translateDeleteModalSpinner,
  translateDeleteModalSuccess,
  translateDeleteModalTitle,
} from '@app/common/utils/translation-helpers';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Button, InlineAlert, ModalTitle, Text } from 'suomifi-ui-components';
import { useBreakpoints } from 'yti-common-ui/media-query';
import {
  ButtonFooter,
  NarrowModal,
  SimpleModalContent,
} from './../as-file-modal/as-file-modal.styles';
import SaveSpinner from 'yti-common-ui/save-spinner';
import getApiError from '@app/common/utils/get-api-errors';

interface DeleteModalProps {
  modelId: string;
  resourceId?: string;
  label: string;
  type: 'model' | 'class' | 'attribute' | 'association';
  onClose?: () => void;
  visible: boolean;
  hide: () => void;
  applicationProfile?: boolean;
}

export default function DeleteModal({
  modelId,
  label,
  type,
  resourceId,
  onClose,
  visible,
  hide,
  applicationProfile,
}: DeleteModalProps) {
  const { t } = useTranslation('admin');
  const { isSmall } = useBreakpoints();
  const router = useRouter();
  const [deleteModel, deleteModelResult] = useDeleteModelMutation();
  const [deleteClass, deleteClassResult] = useDeleteClassMutation();
  const [deleteResource, deleteResourceResult] = useDeleteResourceMutation();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [userPosted, setUserPosted] = useState(false);

  const handleClose = () => {
    setUserPosted(false);
    setError(false);
    hide();
  };

  const handleSuccessExit = () => {
    handleClose();
    if (type === 'model') {
      router.push('/');
    }
    //If added extra on close function call it
    if (onClose) {
      onClose();
    }
  };

  const handleDelete = () => {
    setUserPosted(true);
    if (type === 'model') {
      deleteModel(modelId);
    } else if (type === 'class') {
      deleteClass({
        modelId: modelId,
        classId: resourceId ?? '',
        applicationProfile,
      });
    } else {
      deleteResource({
        modelId: modelId,
        resourceId: resourceId ?? '',
        applicationProfile,
      });
    }
  };

  useEffect(() => {
    if (
      deleteClassResult.isSuccess ||
      deleteModelResult.isSuccess ||
      deleteResourceResult.isSuccess
    ) {
      setSuccess(true);
      setError(false);
      setUserPosted(false);
    } else if (
      deleteClassResult.isError ||
      deleteModelResult.isError ||
      deleteResourceResult.isError
    ) {
      setSuccess(false);
      setError(true);
      setUserPosted(false);
    }
  }, [deleteClassResult, deleteModelResult, deleteResourceResult]);

  const renderSuccess = () => {
    return (
      <>
        <ModalTitle>{translateDeleteModalTitle(type, t)}</ModalTitle>
        <Text>{translateDeleteModalSuccess(type, t)}</Text>

        <ButtonFooter>
          <Button onClick={() => handleSuccessExit()} id="close-button">
            {type === 'model'
              ? t('return-to-front-page')
              : t('close', { ns: 'common' })}
          </Button>
        </ButtonFooter>
      </>
    );
  };

  const renderConfirm = () => {
    return (
      <>
        <ModalTitle>{translateDeleteModalTitle(type, t)}</ModalTitle>
        <Text>{translateDeleteModalDescription(type, t, label)}</Text>

        <ButtonFooter>
          <Button
            disabled={userPosted}
            onClick={() => handleDelete()}
            id="delete-button"
          >
            {t('remove')}
          </Button>
          <Button
            variant="secondary"
            onClick={() => handleClose()}
            id="cancel-button"
          >
            {t('cancel-variant')}
          </Button>
          {userPosted && (
            <SaveSpinner text={translateDeleteModalSpinner(type, t)} />
          )}
        </ButtonFooter>
      </>
    );
  };

  const renderError = () => {
    return (
      <>
        <ModalTitle>{translateDeleteModalTitle(type, t)}</ModalTitle>

        <InlineAlert status="error">
          {translateDeleteModalError(type, t)}
          <br />
          {deleteModelResult.isError && getApiError(deleteModelResult.error)}
          {deleteClassResult.isError && getApiError(deleteClassResult.error)}
          {deleteResourceResult.isError &&
            getApiError(deleteResourceResult.error)}
        </InlineAlert>
        <ButtonFooter>
          <Button onClick={() => handleDelete()} id="try-again-button">
            {t('try-again')}
          </Button>
          <Button
            variant="secondary"
            onClick={() => handleClose()}
            id="cancel-button"
          >
            {t('cancel-variant')}
          </Button>
        </ButtonFooter>
      </>
    );
  };

  return (
    <>
      <NarrowModal
        appElementId="__next"
        visible={visible}
        variant={isSmall ? 'smallScreen' : 'default'}
        onEscKeyDown={() => hide()}
      >
        <SimpleModalContent>
          {success && renderSuccess()}
          {!success && !error && renderConfirm()}
          {error && renderError()}
        </SimpleModalContent>
      </NarrowModal>
    </>
  );
}
