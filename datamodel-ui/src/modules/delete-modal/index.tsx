import { useDeleteClassMutation } from '@app/common/components/class/class.slice';
import { useDeleteModelMutation } from '@app/common/components/model/model.slice';
import { useDeleteResourceMutation } from '@app/common/components/resource/resource.slice';
import {
  translateDeleteModalDescription,
  translateDeleteModalError,
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

interface DeleteModalProps {
  modelId: string;
  resourceId?: string;
  label: string;
  type: 'model' | 'class' | 'attribute' | 'association';
  onClose?: () => void;
  applicationProfile?: boolean;
}

export default function DeleteModal({
  modelId,
  label,
  type,
  resourceId,
  onClose,
  applicationProfile,
}: DeleteModalProps) {
  const { t } = useTranslation('admin');
  const { isSmall } = useBreakpoints();
  const [visible, setVisible] = useState(false);
  const router = useRouter();
  const [deleteModel, deleteModelResult] = useDeleteModelMutation();
  const [deleteClass, deleteClassResult] = useDeleteClassMutation();
  const [deleteResource, deleteResourceResult] = useDeleteResourceMutation();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const handleClose = () => {
    setVisible(false);
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
    } else if (
      deleteClassResult.isError ||
      deleteModelResult.isError ||
      deleteResourceResult.isError
    ) {
      setSuccess(false);
      setError(true);
    }
  }, [deleteClassResult, deleteModelResult, deleteResourceResult]);

  const renderSuccess = () => {
    return (
      <>
        <ModalTitle>{translateDeleteModalTitle(type, t)}</ModalTitle>
        <Text>{translateDeleteModalSuccess(type, t)}</Text>

        <ButtonFooter>
          <Button onClick={() => handleSuccessExit()}>
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
          <Button onClick={() => handleDelete()}>{t('remove')}</Button>
          <Button variant="secondary" onClick={() => handleClose()}>
            {t('cancel-variant')}
          </Button>
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
        </InlineAlert>
        <ButtonFooter>
          <Button onClick={() => handleDelete()}>{t('try-again')}</Button>
          <Button variant="secondary" onClick={() => handleClose()}>
            {t('cancel-variant')}
          </Button>
        </ButtonFooter>
      </>
    );
  };

  return (
    <>
      <Button onClick={() => setVisible(true)} variant="secondaryNoBorder">
        {t('remove')}
      </Button>

      <NarrowModal
        appElementId="__next"
        visible={visible}
        variant={isSmall ? 'smallScreen' : 'default'}
        onEscKeyDown={() => setVisible(false)}
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
