import { Expander, ExpanderContent, ExpanderTitleButton, Paragraph, Text } from 'suomifi-ui-components';
import { TermModalParagraph } from './term-modal.style';

interface TermExpanderProps {
  t?: number;
}

export default function TermExpander({ t }: TermExpanderProps) {

  if (t) {
    return (
      <Expander>
        <ExpanderTitleButton asHeading='h3'>
          Hallinnolliset tiedot
        </ExpanderTitleButton>
        <ExpanderContent>

          <TermModalParagraph marginBottomSpacing='m'>
            <Text variant='bold'>
              Muutoshistoria
            </Text>
            <Text>
              Lorem ipsum dolor sit amet
            </Text>
          </TermModalParagraph>

          <TermModalParagraph marginBottomSpacing='m'>
            <Text variant='bold'>
              Käytön historiatieto (etymologia)
            </Text>
            <Text>
              Lorem ipsum dolor sit amet
            </Text>
          </TermModalParagraph>

          <TermModalParagraph marginBottomSpacing='m'>
            <Text variant='bold'>
              Ylläpitäjän muistiinpano (ei näy kirjautumattomalle)
            </Text>
            <Text>
              Lorem ipsum dolor sit amet
            </Text>
          </TermModalParagraph>

          <TermModalParagraph marginBottomSpacing='m'>
            <Text variant='bold'>
              Luonnosvaiheen kommentti (näkyy vain luonnostilassa)
            </Text>
            <Text>
              Lorem ipsum dolor sit amet
            </Text>
          </TermModalParagraph>

        </ExpanderContent>
      </Expander>
    );
  }

  return (
    <Expander>
      <ExpanderTitleButton asHeading='h3'>
        Kieliopilliset lisätiedot
      </ExpanderTitleButton>
      <ExpanderContent>

        <TermModalParagraph marginBottomSpacing='m'>
          <Text variant='bold'>
            Termin tyyli
          </Text>
          <Text>
            Puhekieli
          </Text>
        </TermModalParagraph>

        <TermModalParagraph marginBottomSpacing='m'>
          <Text variant='bold'>
            Termin suku
          </Text>
          <Text>
            maskuliini
          </Text>
        </TermModalParagraph>

        <TermModalParagraph marginBottomSpacing='m'>
          <Text variant='bold'>
            Termin luku
          </Text>
          <Text>
            Yksikkö
          </Text>
        </TermModalParagraph>

        <TermModalParagraph marginBottomSpacing='m'>
          <Text variant='bold'>
            Termin sanaluokka
          </Text>
          <Text>
            ...(merkitään vain jos eri sanaluokasta kuin muunkieliset termit)
          </Text>
        </TermModalParagraph>

      </ExpanderContent>
    </Expander>
  );

};
