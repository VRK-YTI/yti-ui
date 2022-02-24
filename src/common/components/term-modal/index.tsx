import { useState } from 'react';
import { Button, Chip, ExternalLink, Modal, ModalContent, ModalFooter, ModalTitle, Text } from 'suomifi-ui-components';
import { Term } from '../../interfaces/term.interface';
import TermExpander from './term-expander';
import { TermModalChip, TermModalParagraph } from './term-modal.style';

interface TermModalProps {
  data?: { term: Term, type: string };
}

export default function TermModal({ data }: TermModalProps) {
  const [visible, setVisible] = useState<boolean>(false);

  if (!data) {
    return null;
  }

  console.log(data);


  return (
    <>
      <Button variant='secondaryNoBorder' onClick={() => setVisible(true)}>
        termi
      </Button>
      <Modal
        appElementId='__next'
        visible={visible}
        onEscKeyDown={() => setVisible(false)}
      >
        <ModalContent>
          <ModalTitle>hakemus</ModalTitle>

          <TermModalParagraph marginBottomSpacing='m'>
            <Text variant='bold'>
              Tyyppi
            </Text>
            <Text>
              Suositeltava termi
            </Text>
          </TermModalParagraph>

          <TermModalParagraph marginBottomSpacing='m'>
            <Text variant='bold'>
              Tila
            </Text>
            <TermModalChip disabled={true}>VOIMASSA OLEVA</TermModalChip>
          </TermModalParagraph>

          <TermModalParagraph marginBottomSpacing='m'>
            <Text variant='bold'>
              Homonyymin järjestysnumero
            </Text>
            <Text>
              1
            </Text>
          </TermModalParagraph>

          <TermModalParagraph marginBottomSpacing='m'>
            <Text variant='bold'>
              Termin lisätieto
            </Text>
            <Text>
              vapaata tekstiä
            </Text>
          </TermModalParagraph>

          <TermModalParagraph marginBottomSpacing='m'>
            <Text variant='bold'>
              Käyttöala
            </Text>
            <Text>
              Tekninen
            </Text>
          </TermModalParagraph>


          <TermModalParagraph marginBottomSpacing='m'>
            <Text variant='bold'>
              Termin vastaavuus
            </Text>
            <Text>
              Lähes sama kuin (~)
            </Text>
          </TermModalParagraph>

          <TermModalParagraph marginBottomSpacing='m'>
            <Text variant='bold'>
              Termi, johon vastaavuus liittyy
            </Text>
            <Text>
              hakemus
            </Text>
          </TermModalParagraph>

          <TermModalParagraph marginBottomSpacing='m'>
            <Text variant='bold'>
              Lähde
            </Text>
            <ExternalLink href='#' labelNewWindow='linkki sivulle x'>
              Kansalliskirjasto
            </ExternalLink>
            <Text>
              Lorem ipsum dolor sit amet
            </Text>
          </TermModalParagraph>

          <TermExpander t={1} />

          <TermExpander />

        </ModalContent>

        <ModalFooter>
          <Button onClick={() => setVisible(false)}>
            Sulje
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );

};
