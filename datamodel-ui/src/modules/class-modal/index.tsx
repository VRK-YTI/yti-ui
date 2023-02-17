import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import {
  Button,
  ModalContent,
  ModalFooter,
  ModalTitle,
} from 'suomifi-ui-components';
import { useBreakpoints } from 'yti-common-ui/media-query';
import MultiColumnSearch from 'yti-common-ui/multi-column-search';
import { LargeModal } from './class-modal.styles';

export interface ClassModalProps {
  handleFollowUp: (value: any) => void;
}

export default function ClassModal({ handleFollowUp }: ClassModalProps) {
  const { t } = useTranslation('admin');
  const { isSmall } = useBreakpoints();
  const [visible, setVisible] = useState(false);
  const [selectedClass, setSelectedClass] = useState<undefined | string>();

  const handleClose = () => {
    setSelectedClass(undefined);
    setVisible(false);
  };

  return (
    <>
      <Button variant="secondary" icon="plus" onClick={() => setVisible(true)}>
        {t('add-class')}
      </Button>

      <LargeModal
        appElementId="__next"
        visible={visible}
        onEscKeyDown={() => setVisible(false)}
        variant={isSmall ? 'smallScreen' : 'default'}
      >
        <ModalContent>
          <ModalTitle>Lisää luokka</ModalTitle>
          <MultiColumnSearch
            selected={selectedClass}
            setSelected={setSelectedClass}
          />
        </ModalContent>
        <ModalFooter>
          <Button
            disabled={typeof selectedClass !== 'string'}
            onClick={() => handleFollowUp(selectedClass)}
          >
            Luo valitulle alaluokka
          </Button>
          <Button icon="plus" onClick={() => handleFollowUp(selectedClass)}>
            Luo uusi luokka
          </Button>
          <Button variant="secondaryNoBorder" onClick={() => handleClose()}>
            Peruuta
          </Button>
        </ModalFooter>
      </LargeModal>
    </>
  );
}
