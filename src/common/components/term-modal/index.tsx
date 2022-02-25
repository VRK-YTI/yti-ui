import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Modal, ModalContent, ModalFooter, ModalTitle, Text } from 'suomifi-ui-components';
import { Term } from '../../interfaces/term.interface';
import { Property } from '../../interfaces/termed-data-types.interface';
import { selectLogin } from '../login/login-slice';
import PropertyValue from '../property-value';
import { getPropertyValue } from '../property-value/get-property-value';
import TermExpander from './term-expander';
import { TermModalButton, TermModalChip, TermModalParagraph } from './term-modal.style';
import { useBreakpoints } from '../media-query/media-query-context';

interface TermModalProps {
  data?: { term: Term, type: string };
}

export default function TermModal({ data }: TermModalProps) {
  const { t } = useTranslation('common');
  const { isSmall } = useBreakpoints();
  const [visible, setVisible] = useState<boolean>(false);
  const user = useSelector(selectLogin());

  if (!data) {
    return null;
  }

  return (
    <>
      <TermModalButton variant='secondaryNoBorder' onClick={() => setVisible(true)}>
        {/*
          Note: Preferencing upper solution instead of <PropertyValue />
          because term should only have one prefLabel. If prefLabel is
          in English and the language used is Finnish the button won't
          be rendered. Same solution in <ModalTitle /> below.
        */}
        {
          data.term.properties.prefLabel?.[0].value
          ??
          <PropertyValue
            property={data.term.properties.prefLabel}
            fallbackLanguage='fi'
          />
        }
      </TermModalButton>
      <Modal
        appElementId='__next'
        visible={visible}
        onEscKeyDown={() => setVisible(false)}
        variant={isSmall ? 'smallScreen' : 'default'}
      >
        <ModalContent>
          <ModalTitle>
            {
              data.term.properties.prefLabel?.[0].value
              ??
              <PropertyValue
                property={data.term.properties.prefLabel}
                fallbackLanguage='fi'
              />
            }
          </ModalTitle>

          {renderInfo('Tyyppi', data.type)}
          {renderInfoChip('Tila', data.term.properties.status)}
          {renderInfo('Homonyymin järjestysnumero', data.term.properties.termHomographNumber?.[0].value)}
          {renderInfo('Termin lisätieto', data.term.properties.termInfo?.[0].value)}
          {renderInfo('Käyttöala', data.term.properties.scope?.[0].value)}
          {renderInfo('Termin vastaavuus', data.term.properties.termEquivalency?.[0].value)}
          {/* TODO: Termi, john vastaavuus liittyy isn't probably implemented yet*/}
          {/* {renderInfo('Termi, johon vastaavuus liittyy', data.term.referrers.prefLabel?.[0].properties.wordClas?.[0].value)} */}
          {renderInfo('Lähde', data.term.properties.source?.[0].value)}

          <TermExpander
            title='Hallinnolliset tiedot'
            data={[
              { subtitle: 'Muutoshistoria', value: data.term.properties.changeNote?.[0].value },
              { subtitle: 'Käytön historiatieto (etymologia)', value: data.term.properties.historyNote?.[0].value },
              { subtitle: 'Ylläpitäjän muistiinpano (ei näy kirjautumattomalle)', value: data.term.properties.editorialNote?.[0].value, checkCondition: !user.anonymous },
              { subtitle: 'Luonnosvaiheen kommentti (näkyy vain luonnostilassa)', value: data.term.properties.draftComment?.[0].value, checkCondition: data.term.properties.status?.[0].value === 'DRAFT' }
            ]}
          />
          <TermExpander
            title='Kieliopilliset lisätiedot'
            data={[
              { subtitle: 'Termin tyyli', value: data.term.properties.termStyle?.[0].value },
              { subtitle: 'Termin suku', value: data.term.properties.termFamily?.[0].value },
              { subtitle: 'Termin luku', value: data.term.properties.termConjugation?.[0].value },
              { subtitle: 'Termin sanaluokka', value: data.term.properties.wordClass?.[0].value }
            ]}
          />
        </ModalContent>

        <ModalFooter>
          <Button
            onClick={() => setVisible(false)}
            aria-label='Sulje termin tiedot'
          >
            Sulje
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );

  function renderInfo(subtitle: string, value?: string) {
    if (!value) {
      return null;
    }

    return (
      <TermModalParagraph marginBottomSpacing='m'>
        <Text variant='bold'>
          {subtitle}
        </Text>
        <Text>
          {value}
        </Text>
      </TermModalParagraph>
    );
  }

  function renderInfoChip(subtitle: string, value?: Property[]) {
    if (!value) {
      return null;
    }

    return (
      <TermModalParagraph marginBottomSpacing='m'>
        <Text variant='bold'>
          {subtitle}
        </Text>
        <TermModalChip disabled={true} isValid={value[0].value === 'VALID'}>
          {t(getPropertyValue({ property: value }) ?? '', { ns: 'common' })}
        </TermModalChip>
      </TermModalParagraph>
    );
  }

};
