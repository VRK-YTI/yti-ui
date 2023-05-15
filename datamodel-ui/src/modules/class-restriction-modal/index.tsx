import { useTranslation } from 'next-i18next';
import {
  Button,
  Modal,
  ModalContent,
  ModalFooter,
  ModalTitle,
} from 'suomifi-ui-components';

interface ClassRestrictionModalProps {
  visible: boolean;
  hide: () => void;
}

export default function ClassRestrictionModal({
  visible,
  hide,
}: ClassRestrictionModalProps) {
  const { t } = useTranslation('admin');

  const handleClose = () => {
    hide();
  };

  return (
    <Modal
      appElementId="__next"
      visible={visible}
      onEscKeyDown={() => handleClose()}
    >
      <ModalContent>
        <ModalTitle>Lisää luokka</ModalTitle>
      </ModalContent>

      <ModalFooter>
        <Button>Valitse luokkarajoite</Button>
        <Button variant="secondary">Luo uusi luokkarajoite</Button>
        <Button variant="secondaryNoBorder" onClick={() => handleClose()}>
          {t('cancel-variant')}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
