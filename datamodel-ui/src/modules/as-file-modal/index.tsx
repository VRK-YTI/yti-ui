import { useState } from 'react';
import { Button, ModalTitle, RadioButton, Text } from 'suomifi-ui-components';
import { useBreakpoints } from 'yti-common-ui/media-query';
import {
  ButtonFooter,
  NarrowModal,
  RadioButtonGroupSimple,
  SimpleModalContent,
} from './as-file-modal.styles';

interface AsFileModalProps {
  type: 'show' | 'download';
}

export default function AsFileModal({ type }: AsFileModalProps) {
  const { isSmall } = useBreakpoints();
  const [visible, setVisible] = useState(false);
  const fileTypes = ['JSON-LD', 'RDF', 'XML', 'Turtle', 'OpenAPI'];

  const handleClose = () => {
    setVisible(false);
  };

  const handleSubmit = () => {
    handleClose();
  };

  return (
    <>
      <Button onClick={() => setVisible(true)}>Click {type}</Button>

      <NarrowModal
        appElementId="__next"
        visible={visible}
        variant={isSmall ? 'smallScreen' : 'default'}
        onEscKeyDown={() => setVisible(false)}
      >
        {type === 'show' ? renderShowView() : renderDownloadView()}
      </NarrowModal>
    </>
  );

  function renderShowView() {
    return (
      <SimpleModalContent>
        <div>
          <ModalTitle>Näytä tiedostona</ModalTitle>
          <Text variant="bold">
            Valitse tiedostoformaatti, jossa haluat tarkastella tietomallia.
            Tiedosto aukeaa uudelle välilehdelle.
          </Text>
          <RadioButtonGroupSimple
            labelText=""
            defaultValue="JSON-LD"
            name="file-types-radio-button-group"
          >
            {fileTypes.map((type) => (
              <RadioButton key={`file-type-radio-button-${type}`} value={type}>
                {type}
              </RadioButton>
            ))}
          </RadioButtonGroupSimple>
        </div>

        <ButtonFooter>
          <Button onClick={() => handleSubmit()}>Näytä</Button>
          <Button variant="secondary" onClick={() => handleClose()}>
            Peruuta
          </Button>
        </ButtonFooter>
      </SimpleModalContent>
    );
  }

  function renderDownloadView() {
    return (
      <SimpleModalContent>
        <div>
          <ModalTitle>Lataa tiedostona</ModalTitle>
          <Text variant="bold">
            Valitse tiedostoformaatti, jossa haluat ladata tietomallin.
          </Text>
          <RadioButtonGroupSimple
            labelText=""
            name="file-types-radio-button-group"
            defaultValue="JSON-LD"
          >
            {fileTypes.map((type) => (
              <RadioButton key={`file-type-radio-button-${type}`} value={type}>
                {type}
              </RadioButton>
            ))}
          </RadioButtonGroupSimple>
        </div>

        <ButtonFooter>
          <Button onClick={() => handleSubmit()}>Lataa</Button>
          <Button variant="secondary" onClick={() => handleClose()}>
            Peruuta
          </Button>
        </ButtonFooter>
      </SimpleModalContent>
    );
  }
}
