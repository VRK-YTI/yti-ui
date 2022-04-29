import { BasicBlock } from '@app/common/components/block';
import { BasicBlockExtraWrapper } from '@app/common/components/block/block.styles';
import Separator from '@app/common/components/separator';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { Button, Checkbox, CheckboxGroup, Chip, ExpanderTitleButton, Paragraph, Text } from 'suomifi-ui-components';
import { ConceptExpander, ExpanderContentFitted } from './concept-basic-information.styles';
import { ChipBlock } from './concept-info-block.styles';

export default function RelationalInformation() {
  const { t } = useTranslation('admin');

  return (
    <ConceptExpander>
      <ExpanderTitleButton asHeading="h3">
        {t('relational-information')}
      </ExpanderTitleButton>

      <ExpanderContentFitted>
        <BasicBlockWithChips
          title={'Hierkkinen yläkäsite'}
          buttonTitle={'Lisää uusi hierarkkinen yläkäsite'}
          description={'Laajempi käsite, johon tämä käsite liittyy.'}
          chipDescription={'Valitut hierarkkiset yläkäsitteeet'}
        />

        <Separator isLarge />

        <BasicBlockWithChips
          title={'Hierkkinen alakäsite'}
          buttonTitle={'Lisää uusi hierarkkinen alakäsite'}
          description={'Käsite, joka on hierarkkisessa suhteessa tähän käsitteeseen ja jonka sisältöön kuuluu tämän käsitteen sisältö.'}
          chipDescription={'Valitut hierarkkiset alakäsitteeet'}
        />

        <Separator isLarge />

        <BasicBlockWithChips
          title={'Liittyvä käsite'}
          buttonTitle={'Lisää uusi liittyvä käsite'}
          description={'Käsite, joka liittyy tähän käsitteeseen.'}
          chipDescription={'Valitut liittyvät käsitteeet'}
        />

        <Separator isLarge />

        <BasicBlockWithChips
          title={'Koostumussuhteinen yläkäsite'}
          buttonTitle={'Lisää uusi koostumussuhteinen yläkäsite'}
          description={'Käsite, johon tämä käsite kuuluu (on osa).'}
          chipDescription={'Valitut koostumussuhteiset yläkäsitteet'}
        />

        <Separator isLarge />

        <BasicBlockWithChips
          title={'Koostumussuhteinen alakäsite'}
          buttonTitle={'Lisää uusi koostumussuhteinen alakäsite'}
          description={'Käsite, joka vastaa kokonaisuuden osaa.'}
          chipDescription={'Valitut koostumussuhteiset alakäsitteet'}
        />

        <Separator isLarge />

        <BasicBlockWithChips
          title={'Liittyvä käsite toisessa sanastossa'}
          buttonTitle={'Lisää uusi liittyvä käsite'}
          description={'Käsite joka liittyy tähän käsitteeseen. Sijaitsee toisessa sanastossa.'}
          chipDescription={'Valitut liittyvät käsitteet'}
        />

        <Separator isLarge />

        <BasicBlockWithChips
          title={'Vastaava käsite toisessa sanastossa'}
          buttonTitle={'Lisää uusi vastaava käsite'}
          description={'Käsite jota voidaan käyttää tämän käsitteen sijaan. Sijaitsee toisessa sanastossa.'}
          chipDescription={'Valitut vastaavat käsitteet'}
        />

        <Separator isLarge />

        <CheckboxGroup
          labelText='Valitse homonyymit muista sanastoista'
          groupHintText='Muissa sanastoissa on käsitteitä, jotka vastaavat tätä käsitettä. Valitse ne, jotka haluat näytettävän käsitteesi yhteydessä.'
        >
          <Checkbox hintText='Patentti- ja rekisterihallituksen sanasto'>
            hakemus
          </Checkbox>
          <Checkbox hintText='Opetus- ja koulutussanasto, 2. laitos'>
            hakemus
          </Checkbox>
          <Checkbox hintText='Julkisen hallinnon yhteinen sanasto'>
            hakemus
          </Checkbox>
        </CheckboxGroup>

      </ExpanderContentFitted>
    </ConceptExpander>
  );
}

function BasicBlockWithChips({ title, buttonTitle, description, chipDescription }: any) {
  const [items, setItems] = useState<number[]>([]);
  return (
    <BasicBlock
      title={title}
      extra={
        <BasicBlockExtraWrapper>
          <Button
            variant='secondary'
            onClick={() => setItems([...items, items.length])}
          >
            {buttonTitle}
          </Button>

          {items.length > 0 &&
            <div style={{marginTop: '20px'}}>
              <Paragraph>
                <Text variant='bold' smallScreen>{chipDescription}</Text>
              </Paragraph>

              <ChipBlock>
                {items.map(item => {
                  return (
                    <Chip
                      key={item}
                      removable
                      onClick={() => setItems(items.filter(tItem => tItem !== item))}
                    >
                      {item}
                    </Chip>
                  );
                })}
              </ChipBlock>
            </div>
          }
        </ BasicBlockExtraWrapper>
      }
    >
      {description}
    </BasicBlock>
  );
}
