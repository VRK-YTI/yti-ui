import {
  setDisplayGraphHasChanges,
  setResetPosition,
  setSavePosition,
} from '@app/common/components/model/model.slice';
import { useStoreDispatch } from '@app/store';
import { useTranslation } from 'next-i18next';
import {
  Button,
  Modal,
  ModalContent,
  ModalFooter,
  ModalTitle,
  Paragraph,
  Text,
} from 'suomifi-ui-components';

export default function UnsavedAlertModal({
  visible,
  handleFollowUp,
}: {
  visible: boolean;
  handleFollowUp: () => void;
}) {
  const { t } = useTranslation('admin');
  const dispatch = useStoreDispatch();

  if (!visible) {
    return <></>;
  }

  const handleClose = () => {
    dispatch(setDisplayGraphHasChanges(false));
  };

  const handleSaveAndContinue = () => {
    dispatch(setSavePosition(true));
    handleClose();
    handleFollowUp();
  };

  const handleResetAndContinue = () => {
    dispatch(setResetPosition(true));
    handleClose();
    handleFollowUp();
  };

  return (
    <Modal
      appElementId="__next"
      visible={visible}
      onEscKeyDown={() => handleClose()}
      scrollable={false}
    >
      <ModalContent>
        <ModalTitle>{t('graph-has-unsaved-changes')}</ModalTitle>

        <Paragraph>
          <Text>{t('graph-has-unsaved-changes-description')}</Text>
        </Paragraph>
      </ModalContent>

      <ModalFooter>
        <Button onClick={() => handleSaveAndContinue()}>
          {t('save-changes')}
        </Button>

        <Button onClick={() => handleResetAndContinue()}>
          {t('undo-changes')}
        </Button>

        <Button variant="secondary" onClick={() => handleClose()}>
          {t('cancel-variant')}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
