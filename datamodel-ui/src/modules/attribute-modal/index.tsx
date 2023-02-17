import { useState } from 'react';
import {
  Button,
  ModalContent,
  ModalFooter,
  ModalTitle,
} from 'suomifi-ui-components';
import { useBreakpoints } from 'yti-common-ui/media-query';
import MultiColumnSearch from 'yti-common-ui/multi-column-search';
import { LargeModal } from './attribute-modal.styles';

export default function AttributeModal() {
  const { isSmall } = useBreakpoints();
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState('');

  return (
    <div>
      <Button variant="secondary" onClick={() => setVisible(true)}>
        Lisää attribuutti
      </Button>
      <LargeModal
        appElementId="__next"
        visible={visible}
        variant={isSmall ? 'smallScreen' : 'default'}
      >
        <ModalContent>
          <ModalTitle>Lisää attribuutti</ModalTitle>
          <MultiColumnSearch
            selected={selected}
            setSelected={setSelected}
            languageVersioned
          />
        </ModalContent>
        <ModalFooter>
          <Button>Ota käyttöön sellaisenaan</Button>
          <Button variant="secondary" onClick={() => setVisible(false)}>
            Peruuta
          </Button>
        </ModalFooter>
      </LargeModal>
    </div>
  );
}
