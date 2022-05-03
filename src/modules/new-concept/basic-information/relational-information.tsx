import Separator from '@app/common/components/separator';
import { useTranslation } from 'next-i18next';
import {
  Checkbox,
  CheckboxGroup,
  ExpanderTitleButton,
} from 'suomifi-ui-components';
import {
  ConceptExpander,
  ExpanderContentFitted,
} from './concept-basic-information.styles';
import RelationalInformationBlock from './relational-information-block';

export default function RelationalInformation() {
  const { t } = useTranslation('admin');

  return (
    <ConceptExpander>
      <ExpanderTitleButton asHeading="h3">
        {t('relational-information')}
      </ExpanderTitleButton>

      <ExpanderContentFitted>
        <RelationalInformationBlock
          title={'Hierkkinen yläkäsite'}
          buttonTitle={'Lisää uusi hierarkkinen yläkäsite'}
          description={'Laajempi käsite, johon tämä käsite liittyy.'}
          chipDescription={'Valitut hierarkkiset yläkäsitteeet'}
        />

        <Separator isLarge />

        <RelationalInformationBlock
          title={'Hierkkinen alakäsite'}
          buttonTitle={'Lisää uusi hierarkkinen alakäsite'}
          description={
            'Käsite, joka on hierarkkisessa suhteessa tähän käsitteeseen ja jonka sisältöön kuuluu tämän käsitteen sisältö.'
          }
          chipDescription={'Valitut hierarkkiset alakäsitteeet'}
        />

        <Separator isLarge />

        <RelationalInformationBlock
          title={'Liittyvä käsite'}
          buttonTitle={'Lisää uusi liittyvä käsite'}
          description={'Käsite, joka liittyy tähän käsitteeseen.'}
          chipDescription={'Valitut liittyvät käsitteeet'}
        />

        <Separator isLarge />

        <RelationalInformationBlock
          title={'Koostumussuhteinen yläkäsite'}
          buttonTitle={'Lisää uusi koostumussuhteinen yläkäsite'}
          description={'Käsite, johon tämä käsite kuuluu (on osa).'}
          chipDescription={'Valitut koostumussuhteiset yläkäsitteet'}
        />

        <Separator isLarge />

        <RelationalInformationBlock
          title={'Koostumussuhteinen alakäsite'}
          buttonTitle={'Lisää uusi koostumussuhteinen alakäsite'}
          description={'Käsite, joka vastaa kokonaisuuden osaa.'}
          chipDescription={'Valitut koostumussuhteiset alakäsitteet'}
        />

        <Separator isLarge />

        <RelationalInformationBlock
          title={'Liittyvä käsite toisessa sanastossa'}
          buttonTitle={'Lisää uusi liittyvä käsite'}
          description={
            'Käsite joka liittyy tähän käsitteeseen. Sijaitsee toisessa sanastossa.'
          }
          chipDescription={'Valitut liittyvät käsitteet'}
        />

        <Separator isLarge />

        <RelationalInformationBlock
          title={'Vastaava käsite toisessa sanastossa'}
          buttonTitle={'Lisää uusi vastaava käsite'}
          description={
            'Käsite jota voidaan käyttää tämän käsitteen sijaan. Sijaitsee toisessa sanastossa.'
          }
          chipDescription={'Valitut vastaavat käsitteet'}
        />

        <Separator isLarge />

        <CheckboxGroup
          labelText="Valitse homonyymit muista sanastoista"
          groupHintText="Muissa sanastoissa on käsitteitä, jotka vastaavat tätä käsitettä. Valitse ne, jotka haluat näytettävän käsitteesi yhteydessä."
        >
          <Checkbox hintText="Patentti- ja rekisterihallituksen sanasto">
            hakemus
          </Checkbox>
          <Checkbox hintText="Opetus- ja koulutussanasto, 2. laitos">
            hakemus
          </Checkbox>
          <Checkbox hintText="Julkisen hallinnon yhteinen sanasto">
            hakemus
          </Checkbox>
        </CheckboxGroup>
      </ExpanderContentFitted>
    </ConceptExpander>
  );
}
