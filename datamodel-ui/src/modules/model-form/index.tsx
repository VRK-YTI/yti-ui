import { useGetOrganizationsQuery } from '@app/common/components/organizations/organizations.slice';
import { useGetServiceCategoriesQuery } from '@app/common/components/service-categories/service-categories.slice';
import getOrganizations from '@app/common/utils/get-organizations';
import getServiceCategories from '@app/common/utils/get-service-categories';
import { useTranslation } from 'next-i18next';
import { useMemo, useState } from 'react';
import {
  HintText,
  Label,
  Paragraph,
  RadioButton,
  RadioButtonGroup,
  Text,
  TextInput,
} from 'suomifi-ui-components';
import Separator from 'yti-common-ui/separator';
import {
  BlockContainer,
  ModelFormContainer,
  WideMultiSelect,
} from './model-form.styles';
import LanguageSelector from 'yti-common-ui/form/language-selector';
import Prefix from 'yti-common-ui/form/prefix';
import { useGetFreePrefixMutation } from '@app/common/components/prefix';

export default function ModelForm() {
  const { t, i18n } = useTranslation('adming');
  const [languages, setLanguages] = useState([
    {
      labelText: 'suomi FI',
      uniqueItemId: 'fi',
      title: '',
      description: '',
    },
    {
      labelText: 'ruotsi SV',
      uniqueItemId: 'sv',
      title: '',
      description: '',
    },
    {
      labelText: 'englanti EN',
      uniqueItemId: 'en',
      title: '',
      description: '',
    },
  ]);
  const { data: serviceCategoriesData } = useGetServiceCategoriesQuery();
  const { data: organizationsData } = useGetOrganizationsQuery();

  const serviceCategories = useMemo(() => {
    if (!serviceCategoriesData) {
      return [];
    }

    return getServiceCategories(serviceCategoriesData, i18n.language)
      .map((c) => ({
        labelText: c.label,
        uniqueItemId: c.id,
      }))
      .sort((c1, c2) => (c1.labelText > c2.labelText ? 1 : -1));
  }, [serviceCategoriesData, i18n.language]);

  const organizations = useMemo(() => {
    if (!organizationsData) {
      return [];
    }

    return getOrganizations(organizationsData, i18n.language)
      .map((o) => ({
        labelText: o.label,
        uniqueItemId: o.id,
      }))
      .sort((o1, o2) => (o1.labelText > o2.labelText ? 1 : -1));
  }, [organizationsData, i18n.language]);

  console.log('languages', languages);

  return (
    <div>
      <RadioButtonGroup
        labelText="Tietomallin tyyppi"
        name="type"
        defaultValue="profile"
      >
        <RadioButton
          value="profile"
          hintText="Tiettyyn asiayhteyteen liittyvä tietomalli, joka hyödyntää ydintietomalleja"
        >
          Soveltamisprofiili
        </RadioButton>
        <RadioButton
          value="library"
          hintText="Yleinen ja uudelleenkäytettävä tietojen sisällön ja rakenteen kuvaus"
        >
          Ydintietomalli
        </RadioButton>
      </RadioButtonGroup>

      <Separator isLarge />

      <BlockContainer>
        <LanguageSelector
          items={languages}
          labelText="Tietosisällön kielet"
          hintText="Valitse tietomallille kielet, joilla tietomallin sisältö on kuvattu."
          visualPlaceholder="Valitse tietomallin kielet"
          isWide={true}
          setLanguages={setLanguages}
          allowItemAddition={false}
          ariaChipActionLabel={''}
          ariaSelectedAmountText={''}
          ariaOptionsAvailableText={''}
          ariaOptionChipRemovedText={''}
          noItemsText={''}
        />

        <Prefix
          validatePrefixMutation={useGetFreePrefixMutation}
          typeInUri={'datamodel'}
        />
      </BlockContainer>

      <Separator isLarge />

      <BlockContainer>
        <WideMultiSelect
          chipListVisible={true}
          labelText="Tietoalueet"
          hintText="Valitse tietomallille sen sisältöä kuvaavat tietoalueet. Tietoalue auttaa tietomallin löydettävyydessä."
          visualPlaceholder="Valitse tietomallin tietoalueet"
          removeAllButtonLabel="Poista kaikki valinnat"
          allowItemAddition={false}
          items={serviceCategories}
          ariaChipActionLabel={''}
          ariaSelectedAmountText={''}
          ariaOptionsAvailableText={''}
          ariaOptionChipRemovedText={''}
          noItemsText={''}
        />

        <WideMultiSelect
          chipListVisible={true}
          labelText="Sisällöntuottajat"
          hintText="Voit lisätä vain organisaation, joka on antanut sinulle muokkausoikeudet"
          visualPlaceholder="Valitse sisällöntuottajat"
          removeAllButtonLabel="Poista kaikki valinnat"
          items={organizations}
          ariaChipActionLabel={''}
          ariaSelectedAmountText={''}
          ariaOptionsAvailableText={''}
          ariaOptionChipRemovedText={''}
          noItemsText={''}
        />
      </BlockContainer>

      <Separator isLarge />

      <BlockContainer>
        <div>
          <Label>Palaute</Label>
          <HintText>
            Voit pyytää käyttäjää antamaan palautetta tietomallista.
          </HintText>
        </div>

        <RadioButtonGroup
          labelText="Palautteen vastaanottotapa"
          name="feedback"
          defaultValue="email"
          id="feedback-type-group"
        >
          <RadioButton value="email">Sähköposti</RadioButton>
          <RadioButton value="undefined">Ei vielä tiedossa</RadioButton>
        </RadioButtonGroup>

        <Paragraph>
          <Text>
            Anna organisaation yleinen sähköpostiosoite, johon käyttäjä voi
            antaa palautetta tietomallista.
            <br />
            Älä käytä henkilökohtaista sähköpostiosoitetta.
          </Text>
        </Paragraph>

        <TextInput
          labelText="Organisaation yleinen sähköpostiosoite"
          visualPlaceholder="Esim. yllapito@example.org"
        />
      </BlockContainer>
    </div>
  );
}
