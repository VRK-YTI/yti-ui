import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { Button, ModalFooter, ModalTitle, Textarea, TextInput } from 'suomifi-ui-components';
import { ModalContentFitted, ModalSmWidth } from './new-diagram-or-link.styles';

export default function NewDiagramOrLink() {
  const { t } = useTranslation('admin');
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button
        variant="secondary"
        onClick={() => setVisible(true)}
      >
        {t('add-new-link')}
      </Button>
      <ModalSmWidth
        visible={visible}
        onEscKeyDown={() => setVisible(false)}
        appElementId='__next'
      >
        <ModalContentFitted>
          <ModalTitle>
            Lisää uusi käsitekaavio tai muu linkki
          </ModalTitle>

          <TextInput
            labelText='Käsitekaavion nimi'
          />
          <TextInput
            labelText='Käsitekaavion verkko-osoite'
          />
          <Textarea
            labelText='Kuvaus'
            optionalText={t('optional')}
            visualPlaceholder='Kirjoita kuvaus'
            fullWidth
          />
        </ModalContentFitted>
        <ModalFooter>
          <Button>
            Tallenna
          </Button>
          <Button
            onClick={() => setVisible(false)}
            variant='secondary'
          >
            Peruuta
          </Button>
        </ModalFooter>
      </ModalSmWidth>
    </>
  );
}
