import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Modal, ModalContent, ModalFooter, ModalTitle, Text } from 'suomifi-ui-components';
import { Term } from '../../interfaces/term.interface';
import { selectLogin } from '../login/login-slice';
import PropertyValue from '../property-value';
import { getPropertyValue } from '../property-value/get-property-value';

import TermExpander from './term-expander';
import { TermModalChip, TermModalParagraph } from './term-modal.style';

interface TermModalProps {
  data?: { term: Term, type: string };
}

export default function TermModal({ data }: TermModalProps) {
  const { t } = useTranslation('common');
  const [visible, setVisible] = useState<boolean>(false);
  const user = useSelector(selectLogin());

  if (!data) {
    return null;
  }

  console.log(data, data.term.properties.status);


  return (
    <>
      <Button variant='secondaryNoBorder' onClick={() => setVisible(true)}>
        <PropertyValue
          property={data.term.properties.prefLabel}
          fallbackLanguage='fi'
        />
      </Button>
      <Modal
        appElementId='__next'
        visible={visible}
        onEscKeyDown={() => setVisible(false)}
      >
        <ModalContent>
          <ModalTitle>
            <PropertyValue
              property={data.term.properties.prefLabel}
              fallbackLanguage='fi'
            />
          </ModalTitle>

          {renderInfo('Tyyppi', data.type)}
          {renderInfo('Tila', t(getPropertyValue({ property: data.term.properties.status }) ?? '', { ns: 'common' }), true)}
          {renderInfo('Homonyymin järjestysnumero', data.term.properties.termHomographNumber?.[0].value)}
          {renderInfo('Termin lisätieto', data.term.properties.termInfo?.[0].value)}
          {renderInfo('Käyttöala', data.term.properties.scope?.[0].value)}
          {renderInfo('Termin vastaavuus', data.term.properties.termEquivalency?.[0].value)}

          {/* TODO: Source for this info is still unknown */}
          {/* <TermModalParagraph marginBottomSpacing='m'>
            <Text variant='bold'>
              Termi, johon vastaavuus liittyy
            </Text>
            <Text>
              hakemus
            </Text>
          </TermModalParagraph> */}

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
              { subtitle: 'Termin sanaluokka', value: '' }
            ]}
          />

        </ModalContent>

        <ModalFooter>
          <Button onClick={() => setVisible(false)}>
            Sulje
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );

  function renderInfo(subtitle: string, value?: string, chip?: boolean) {
    if (!value) {
      return null;
    }

    return (
      <TermModalParagraph marginBottomSpacing='m'>
        <Text variant='bold'>
          {subtitle}
        </Text>
        {!chip
          ?
          <Text>
            {value}
          </Text>
          :
          <TermModalChip disabled={true}>
            {value}
          </TermModalChip>
        }
      </TermModalParagraph>
    );
  }

};
