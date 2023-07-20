import { useBreakpoints } from 'yti-common-ui/media-query';
import {
  ButtonFooter,
  NarrowModal,
  SimpleModalContent,
} from '../as-file-modal/as-file-modal.styles';
import { useEffect, useState } from 'react';
import { Text, Button, ModalTitle, InlineAlert } from 'suomifi-ui-components';
import { useTranslation } from 'next-i18next';
import getApiError from '@app/common/utils/get-api-errors';
import { useDeleteNodeShapePropertyReferenceMutation } from '@app/common/components/class/class.slice';
import { translateDeleteReferenceModalDescription } from '@app/common/utils/translation-helpers';
import { ResourceType } from '@app/common/interfaces/resource-type.interface';

interface RemoveReferenceModalProps {
  visible: boolean;
  hide: () => void;
  name: string;
  resourceType: ResourceType;
  modelId: string;
  classId: string;
  uri: string;
  handleReturn: () => void;
}

export default function RemoveReferenceModal({
  visible,
  hide,
  name,
  resourceType,
  modelId,
  classId,
  uri,
  handleReturn,
}: RemoveReferenceModalProps) {
  const { t } = useTranslation('admin');
  const { isSmall } = useBreakpoints();
  const [error, setError] = useState(false);
  const [deleteReference, result] =
    useDeleteNodeShapePropertyReferenceMutation();

  const handleClose = () => {
    hide();
    setError(false);
  };

  const handleDelete = () => {
    deleteReference({
      prefix: modelId,
      nodeshapeId: classId,
      uri: uri,
    });
  };

  useEffect(() => {
    if (result.isSuccess) {
      handleClose();
      handleReturn();
    } else if (result.isError) {
      setError(true);
    }
  }, [result]);

  return (
    <NarrowModal
      appElementId="__next"
      visible={visible}
      variant={isSmall ? 'smallScreen' : 'default'}
      onEscKeyDown={() => hide()}
    >
      <SimpleModalContent>
        <ModalTitle>{t('remove-reference')}</ModalTitle>
        <Text>
          {translateDeleteReferenceModalDescription(resourceType, name, t)}
        </Text>
        {result.error && error && (
          <InlineAlert status="error">
            {getApiError(result.error)[0]}
          </InlineAlert>
        )}
        <ButtonFooter>
          <Button onClick={handleDelete} id="delete-button">
            {t('remove')}
          </Button>
          <Button variant="secondary" onClick={handleClose} id="cancel-button">
            {t('cancel-variant')}
          </Button>
        </ButtonFooter>
      </SimpleModalContent>
    </NarrowModal>
  );
}
