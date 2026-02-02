import { useBreakpoints } from 'yti-common-ui/media-query';
import {
  ButtonFooter,
  NarrowModal,
  SimpleModalContent,
} from '../as-file-modal/as-file-modal.styles';
import { useEffect, useState } from 'react';
import {
  TextInput,
  Text,
  Button,
  ModalTitle,
  InlineAlert,
} from 'suomifi-ui-components';
import { useTranslation } from 'next-i18next';
import {
  useGetResourceExistsQuery,
  useMakeLocalCopyPropertyShapeMutation,
} from '@app/common/components/resource/resource.slice';
import getApiError from '@app/common/utils/get-api-errors';
import SaveSpinner from 'yti-common-ui/save-spinner';
import { ResourceType } from '../../common/interfaces/resource-type.interface';
import { translateLocalCopyModal } from '../../common/utils/translation-helpers';
import { useStoreDispatch } from '@app/store';
import { setNotification } from '@app/common/components/notifications/notifications.slice';

interface LocalCopyModalProps {
  visible: boolean;
  hide: () => void;
  targetModelId: string;
  sourceModelId: string;
  sourceIdentifier: string;
  handleReturn: (id: string, modelPrefix: string) => void;
  resourceType: ResourceType;
}

export default function LocalCopyModal({
  visible,
  hide,
  targetModelId,
  sourceModelId,
  sourceIdentifier,
  resourceType,
  handleReturn,
}: LocalCopyModalProps) {
  const { t } = useTranslation('admin');
  const { isSmall } = useBreakpoints();
  const dispatch = useStoreDispatch();
  const [error, setError] = useState(false);
  const [newIdentifier, setNewIdentifier] = useState('');
  const [userPosted, setUserPosted] = useState(false);

  const [makeLocalCopy, makeLocalCopyResult] =
    useMakeLocalCopyPropertyShapeMutation();

  const { data: resourceAlreadyExists, isSuccess } = useGetResourceExistsQuery(
    { prefix: targetModelId, identifier: newIdentifier },
    { skip: newIdentifier === '' }
  );

  const handleChange = (value: string) => {
    setNewIdentifier(value);
    setError(false);
  };

  const handleClose = () => {
    setError(false);
    setUserPosted(false);
    setNewIdentifier('');
    hide();
  };

  const handleCreate = () => {
    if (newIdentifier === '') {
      return;
    }

    setUserPosted(true);
    makeLocalCopy({
      modelid: sourceModelId,
      resourceId: sourceIdentifier,
      targetPrefix: targetModelId,
      newIdentifier: newIdentifier,
    });
  };

  useEffect(() => {
    if (makeLocalCopyResult.isSuccess) {
      handleClose();
      dispatch(setNotification('LOCAL_COPY_ADD'));
      handleReturn(newIdentifier, targetModelId);
    } else if (makeLocalCopyResult.isError) {
      setError(true);
      setUserPosted(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [makeLocalCopyResult, dispatch]);

  return (
    <NarrowModal
      appElementId="__next"
      visible={visible}
      variant={isSmall ? 'smallScreen' : 'default'}
      onEscKeyDown={() => hide()}
    >
      <SimpleModalContent>
        <ModalTitle>{t('create-local-copy')}</ModalTitle>
        <Text>{t('create-local-copy-description')}</Text>
        <TextInput
          labelText={translateLocalCopyModal(t, resourceType, 'label')}
          visualPlaceholder={translateLocalCopyModal(
            t,
            resourceType,
            'placeholder'
          )}
          onChange={(e) => handleChange(e?.toString() ?? '')}
          debounce={300}
          id="prefix-input"
          status={isSuccess && resourceAlreadyExists ? 'error' : 'default'}
          statusText={
            isSuccess && resourceAlreadyExists ? t('error-prefix-taken') : ''
          }
        />
        {makeLocalCopyResult.error && error && (
          <InlineAlert status="error">
            {getApiError(makeLocalCopyResult.error)[0]}
          </InlineAlert>
        )}
        <ButtonFooter>
          <Button
            disabled={userPosted}
            onClick={handleCreate}
            id="create-copy-button"
          >
            {t('create-copy')}
          </Button>
          <Button variant="secondary" onClick={handleClose} id="cancel-button">
            {t('cancel-variant')}
          </Button>
          {userPosted && <SaveSpinner text={t('copying-attribute-shape')} />}
        </ButtonFooter>
      </SimpleModalContent>
    </NarrowModal>
  );
}
