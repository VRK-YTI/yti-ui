import { useGetOrganizationsQuery } from '@app/common/components/organizations/organizations.slice';
import { useGetServiceCategoriesQuery } from '@app/common/components/service-categories/service-categories.slice';
import getOrganizations from '@app/common/utils/get-organizations';
import getServiceCategories from '@app/common/utils/get-service-categories';
import { useTranslation } from 'next-i18next';
import { useMemo, useState } from 'react';
import { RadioButton, RadioButtonGroup } from 'suomifi-ui-components';
import Separator from 'yti-common-ui/separator';
import { ModelFormContainer, WideMultiSelect } from './model-form.styles';
import LanguageSelector from 'yti-common-ui/form/language-selector';

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
    <ModelFormContainer>
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

      <Separator />

      <div>
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
      </div>
      <Separator />

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

      <Separator />
    </ModelFormContainer>
  );
}
