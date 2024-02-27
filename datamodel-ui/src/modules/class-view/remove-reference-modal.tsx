import { useBreakpoints } from 'yti-common-ui/media-query';
import {
  ButtonFooter,
  NarrowModal,
  SimpleModalContent,
} from '../as-file-modal/as-file-modal.styles';
import { useEffect, useState } from 'react';
import {
  Text,
  Button,
  ModalTitle,
  InlineAlert,
  ActionMenuItem,
} from 'suomifi-ui-components';
import { useTranslation } from 'next-i18next';
import getApiError from '@app/common/utils/get-api-errors';
import { useDeletePropertyReferenceMutation } from '@app/common/components/class/class.slice';
import { translateDeleteReferenceModalDescription } from '@app/common/utils/translation-helpers';
import { ResourceType } from '@app/common/interfaces/resource-type.interface';
import { useStoreDispatch } from '@app/store';

interface RemoveReferenceModalProps {
  name: string;
  resourceType: ResourceType;
  modelId: string;
  classId: string;
  uri: string;
  applicationProfile?: boolean;
  currentTarget?: string;
}

export default function RemoveReferenceModal({
  name,
  resourceType,
  modelId,
  classId,
  uri,
  applicationProfile,
  currentTarget,
}: RemoveReferenceModalProps) {
  const { t } = useTranslation('admin');
  const { isSmall } = useBreakpoints();
  const [error, setError] = useState(false);
  const [deleteReference, result] = useDeletePropertyReferenceMutation();
  const [showModal, setShowModal] = useState(false);
  const dispatch = useStoreDispatch();

  const handleClose = () => {
    setShowModal(false);
    setError(false);
  };

  const handleDelete = () => {
    deleteReference({
      prefix: modelId,
      identifier: classId,
      uri: uri,
      applicationProfile: applicationProfile ?? false,
      currentTarget,
    });
  };

  useEffect(() => {
    if (result.isSuccess) {
      handleClose();
    } else if (result.isError) {
      setError(true);
    }
  }, [result, dispatch]);

  return (
    <>
      <ActionMenuItem onClick={() => setShowModal(true)}>
        {t('remove-reference', { ns: 'admin' })}
      </ActionMenuItem>
      <NarrowModal
        appElementId="__next"
        visible={showModal}
        variant={isSmall ? 'smallScreen' : 'default'}
        onEscKeyDown={() => setShowModal(false)}
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
            <Button
              variant="secondary"
              onClick={handleClose}
              id="cancel-button"
            >
              {t('cancel-variant')}
            </Button>
          </ButtonFooter>
        </SimpleModalContent>
      </NarrowModal>
    </>
  );
}
