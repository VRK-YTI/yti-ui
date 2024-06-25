import { Button, InlineAlert, ModalTitle, Text } from 'suomifi-ui-components';
import {
  ButtonFooter,
  NarrowModal,
  SimpleModalContent,
} from '../as-file-modal/as-file-modal.styles';
import { useEffect, useState } from 'react';
import { useBreakpoints } from 'yti-common-ui/media-query';
import { useTranslation } from 'react-i18next';
import { useRemoveCodeListMutation } from '@app/common/components/class/class.slice';
import getApiError from '@app/common/utils/get-api-errors';
import { setNotification } from '@app/common/components/notifications/notifications.slice';
import { useStoreDispatch } from '@app/store';

interface RemoveCodeListModalProps {
  codeList?: string;
  modelId: string;
  classId: string;
  attributeUri: string;
  showModal: boolean;
  setShowModal: (open: boolean) => void;
}

export default function RemoveCodeListModal({
  modelId,
  classId,
  attributeUri,
  showModal,
  codeList,
  setShowModal,
}: RemoveCodeListModalProps) {
  const [removeCodeList, removeCodeListResult] = useRemoveCodeListMutation();

  const { t } = useTranslation('admin');
  const { isSmall } = useBreakpoints();
  const [error, setError] = useState(false);
  const dispatch = useStoreDispatch();

  const handleClose = () => {
    setError(false);
    setShowModal(false);
  };

  const handleRemoveCodeList = (codeList: string) => {
    removeCodeList({
      prefix: modelId,
      classIdentifier: classId,
      attributeUri: attributeUri,
      codeList: codeList,
    });
  };

  useEffect(() => {
    if (removeCodeListResult.isSuccess) {
      setShowModal(false);
      dispatch(setNotification('CODE_LIST_REMOVED'));
    } else if (removeCodeListResult.isError) {
      setError(true);
    }
  }, [removeCodeListResult]);

  if (!codeList) {
    return <></>;
  }

  return (
    <NarrowModal
      appElementId="__next"
      visible={showModal}
      variant={isSmall ? 'smallScreen' : 'default'}
      onEscKeyDown={handleClose}
    >
      <SimpleModalContent>
        <ModalTitle>{t('delete-codelist')}</ModalTitle>
        <Text>
          {t('codelist-remove-confirm', {
            name: codeList,
          })}
        </Text>
        {removeCodeListResult.error && error && (
          <InlineAlert status="error">
            {getApiError(removeCodeListResult.error)[0]}
          </InlineAlert>
        )}
        <ButtonFooter>
          <Button
            onClick={() => handleRemoveCodeList(codeList)}
            id="delete-button"
          >
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
