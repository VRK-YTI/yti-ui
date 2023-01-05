import { useGetOrganizationsQuery } from '@app/common/components/organizations/organizations.slice';
import { useGetServiceCategoriesQuery } from '@app/common/components/service-categories/service-categories.slice';
import getOrganizations from '@app/common/utils/get-organizations';
import getServiceCategories from '@app/common/utils/get-service-categories';
import { useTranslation } from 'next-i18next';
import { useEffect, useMemo } from 'react';
import { Block, RadioButton, RadioButtonGroup } from 'suomifi-ui-components';
import Separator from 'yti-common-ui/separator';
import { BlockContainer, WideMultiSelect } from './model-form.styles';
import LanguageSelector from 'yti-common-ui/form/language-selector';
import Prefix from 'yti-common-ui/form/prefix';
import Contact from 'yti-common-ui/form/contact';
import { useGetFreePrefixMutation } from '@app/common/components/prefix';
import { ModelFormType } from '@app/common/interfaces/model-form.interface';
import { FormErrors } from './validate-form';

interface ModelFormProps {
  formData: ModelFormType;
  setFormData: (value: ModelFormType) => void;
  userPosted: boolean;
  errors?: FormErrors;
}

export default function ModelForm({
  formData,
  setFormData,
  userPosted,
  errors,
}: ModelFormProps) {
  const { t, i18n } = useTranslation('admin');
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

  return (
    <Block>
      <RadioButtonGroup
        labelText="Tietomallin tyyppi"
        name="type"
        defaultValue="profile"
        id="model-type-group"
        onChange={(e) =>
          setFormData({ ...formData, type: e as 'profile' | 'library' })
        }
      >
        <RadioButton
          value="profile"
          hintText="Tiettyyn asiayhteyteen liittyvä tietomalli, joka hyödyntää ydintietomalleja"
          id="profile-radio-button"
        >
          Soveltamisprofiili
        </RadioButton>
        <RadioButton
          value="library"
          hintText="Yleinen ja uudelleenkäytettävä tietojen sisällön ja rakenteen kuvaus"
          id="library-radio-button"
        >
          Ydintietomalli
        </RadioButton>
      </RadioButtonGroup>

      <Separator isLarge />

      <BlockContainer>
        <LanguageSelector
          items={formData.languages}
          languages={formData.languages}
          labelText="Tietosisällön kielet"
          hintText="Valitse tietomallille kielet, joilla tietomallin sisältö on kuvattu."
          visualPlaceholder="Valitse tietomallin kielet"
          isWide={true}
          setLanguages={(e) =>
            setFormData({
              ...formData,
              languages: e,
            })
          }
          userPosted={userPosted}
          allowItemAddition={false}
          ariaChipActionLabel={''}
          ariaSelectedAmountText={''}
          ariaOptionsAvailableText={''}
          ariaOptionChipRemovedText={''}
          noItemsText={''}
          status={errors?.languageAmount ? 'error' : 'default'}
        />

        <Prefix
          prefix={formData.prefix}
          setPrefix={(e) =>
            setFormData({
              ...formData,
              prefix: e,
            })
          }
          validatePrefixMutation={useGetFreePrefixMutation}
          typeInUri={'datamodel'}
          initialData={formData.prefix}
          error={errors?.prefix ?? false}
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
          onItemSelectionsChange={(e) =>
            setFormData({
              ...formData,
              serviceCategories: e,
            })
          }
          items={serviceCategories}
          status={userPosted && errors?.serviceCategories ? 'error' : 'default'}
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
          allowItemAddition={false}
          onItemSelectionsChange={(e) =>
            setFormData({
              ...formData,
              organizations: e,
            })
          }
          items={organizations}
          status={userPosted && errors?.organizations ? 'error' : 'default'}
          ariaChipActionLabel={''}
          ariaSelectedAmountText={''}
          ariaOptionsAvailableText={''}
          ariaOptionChipRemovedText={''}
          noItemsText={''}
        />
      </BlockContainer>

      <Separator isLarge />

      <BlockContainer>
        <Contact
          contact={formData.contact}
          setContact={(e) =>
            setFormData({
              ...formData,
              contact: e,
            })
          }
        />
      </BlockContainer>
    </Block>
  );
}
