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

interface LocalCopyModalProps {
  visible: boolean;
  hide: () => void;
  targetModelId: string;
  sourceModelId: string;
  sourceIdentifier: string;
  handleReturn: (id: string, modelPrefix: string) => void;
}

export default function LocalCopyModal({
  visible,
  hide,
  targetModelId,
  sourceModelId,
  sourceIdentifier,
  handleReturn,
}: LocalCopyModalProps) {
  const { t } = useTranslation('admin');
  const { isSmall } = useBreakpoints();
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
      handleReturn(newIdentifier, targetModelId);
    } else if (makeLocalCopyResult.isError) {
      setError(true);
      setUserPosted(false);
    }
  }, [makeLocalCopyResult]);

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
          labelText={t('attribute-restriction-identifier')}
          visualPlaceholder={t('input-attribute-restriction-identifier')}
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
