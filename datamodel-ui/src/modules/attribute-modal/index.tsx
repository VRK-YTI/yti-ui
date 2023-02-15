import { useState } from 'react';
import {
  Button,
  Modal,
  ModalContent,
  ModalFooter,
  ModalTitle,
} from 'suomifi-ui-components';
import MultiColumnSearch from 'yti-common-ui/multi-column-search';

export default function AttributeModal() {
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState('');

  return (
    <div>
      <Button variant="secondary" onClick={() => setVisible(true)}>
        Lisää attribuutti
      </Button>
      <Modal appElementId="__next" visible={visible}>
        <ModalContent>
          <ModalTitle>Lisää attribuutti</ModalTitle>
          <MultiColumnSearch setSelected={setSelected} />
        </ModalContent>
        <ModalFooter>
          <Button>Ota käyttöön sellaisenaan</Button>
          <Button variant="secondary" onClick={() => setVisible(false)}>
            Peruuta
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
