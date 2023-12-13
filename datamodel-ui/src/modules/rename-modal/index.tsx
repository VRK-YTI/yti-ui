import {
  Button,
  InlineAlert,
  ModalTitle,
  Text,
  TextInput,
} from 'suomifi-ui-components';
import {
  ButtonFooter,
  NarrowModal,
  SimpleModalContent,
} from '../as-file-modal/as-file-modal.styles';
import SaveSpinner from 'yti-common-ui/save-spinner';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import getApiError from '@app/common/utils/get-api-errors';
import { useBreakpoints } from 'yti-common-ui/media-query';
import { useGetResourceExistsQuery } from '@app/common/components/resource/resource.slice';
import { useRenameClassMutation } from '@app/common/components/class/class.slice';

interface RenameModalProps {
  visible: boolean;
  hide: () => void;
  modelId: string;
  resourceId: string;
  handleReturn: (resourceId: string, modelId: string) => void;
}

export function RenameModal({
  visible,
  hide,
  modelId,
  resourceId,
  handleReturn,
}: RenameModalProps) {
  const { t } = useTranslation('admin');
  const { isSmall } = useBreakpoints();
  const [error, setError] = useState(false);
  const [userPosted, setUserPosted] = useState(false);
  const [newIdentifier, setNewIdentifier] = useState(resourceId);
  const [renameResource, renameResourceResult] = useRenameClassMutation();

  const { data: resourceAlreadyExists, isSuccess } = useGetResourceExistsQuery(
    { prefix: modelId, identifier: newIdentifier },
    { skip: newIdentifier === '' || newIdentifier === resourceId }
  );

  function handleChange(identifier: string) {
    setNewIdentifier(identifier);
    setError(false);
  }

  function handleRename() {
    if (newIdentifier === '') {
      return;
    }

    setUserPosted(true);
    renameResource({
      prefix: modelId,
      identifier: resourceId,
      newIdentifier,
    });
  }

  const handleClose = (reset?: boolean) => {
    setError(false);
    setUserPosted(false);
    if (reset) {
      setNewIdentifier(resourceId);
    }
    hide();
  };

  useEffect(() => {
    if (renameResourceResult.isSuccess) {
      handleClose();
      handleReturn(newIdentifier, modelId);
    } else if (renameResourceResult.isError) {
      setError(true);
      setUserPosted(false);
    }
  }, [renameResourceResult]);

  useEffect(() => {
    setNewIdentifier(resourceId);
  }, [resourceId]);

  return (
    <NarrowModal
      appElementId="__next"
      visible={visible}
      variant={isSmall ? 'smallScreen' : 'default'}
      onEscKeyDown={() => hide()}
    >
      <SimpleModalContent>
        <ModalTitle>{t('rename-resource')}</ModalTitle>
        <Text style={{ marginBottom: '15px' }}>
          {t('rename-resource-description')}
        </Text>
        <TextInput
          labelText={t('new-identifier')}
          defaultValue={newIdentifier}
          visualPlaceholder={t('new-identifier')}
          onChange={(e) => handleChange(e?.toString() ?? '')}
          debounce={300}
          id="prefix-input"
          status={isSuccess && resourceAlreadyExists ? 'error' : 'default'}
          statusText={
            isSuccess && resourceAlreadyExists ? t('error-prefix-taken') : ''
          }
        />
        {error && (
          <InlineAlert status="error">
            {renameResourceResult.error
              ? getApiError(renameResourceResult.error)[0]
              : ''}
          </InlineAlert>
        )}
        <ButtonFooter>
          <Button
            disabled={
              userPosted ||
              newIdentifier === resourceId ||
              newIdentifier.length < 2 ||
              resourceAlreadyExists
            }
            onClick={handleRename}
            id="rename-button"
          >
            {t('save')}
          </Button>
          <Button
            variant="secondary"
            onClick={() => handleClose(true)}
            id="cancel-button"
          >
            {t('cancel-variant')}
          </Button>
          {userPosted && <SaveSpinner text={t('renaming-resource')} />}
        </ButtonFooter>
      </SimpleModalContent>
    </NarrowModal>
  );
}
