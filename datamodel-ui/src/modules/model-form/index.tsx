import { useGetOrganizationsQuery } from '@app/common/components/organizations/organizations.slice';
import { useGetServiceCategoriesQuery } from '@app/common/components/service-categories/service-categories.slice';
import getOrganizations from '@app/common/utils/get-organizations';
import getServiceCategories from '@app/common/utils/get-service-categories';
import { useTranslation } from 'next-i18next';
import { useMemo } from 'react';
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
  const { data: serviceCategoriesData } = useGetServiceCategoriesQuery(
    i18n.language
  );
  const { data: organizationsData } = useGetOrganizationsQuery(i18n.language);

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
        labelText={t('datamodel-type')}
        name="type"
        defaultValue="profile"
        id="model-type-group"
        onChange={(e) =>
          setFormData({ ...formData, type: e as 'profile' | 'library' })
        }
      >
        <RadioButton
          value="profile"
          hintText={t('profile-hint-text')}
          id="profile-radio-button"
        >
          {t('profile', { ns: 'common' })}
        </RadioButton>
        <RadioButton
          value="library"
          hintText={t('library-hint-text')}
          id="library-radio-button"
        >
          {t('library-variant', { ns: 'common' })}
        </RadioButton>
      </RadioButtonGroup>

      <Separator isLarge />

      <BlockContainer>
        <LanguageSelector
          items={formData.languages}
          languages={formData.languages}
          labelText={t('information-description-languages')}
          hintText={t('information-description-languages-hint-text')}
          visualPlaceholder={t('select-information-description-languages')}
          isWide={true}
          setLanguages={(e) =>
            setFormData({
              ...formData,
              languages: e,
            })
          }
          userPosted={userPosted}
          translations={{
            textInput: t('language-input-text'),
            textDescription: t('description'),
            optionalText: t('optional'),
          }}
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
          typeInUri={'datamodel/ns'}
          error={errors?.prefix ?? false}
          translations={{
            automatic: t('create-prefix-automatically'),
            errorInvalid: t('error-prefix-invalid'),
            errorTaken: t('error-prefix-taken'),
            hintText: t('prefix-input-hint-text'),
            label: t('prefix'),
            manual: t('input-prefix-manually'),
            textInputHint: t('input-prefix'),
            textInputLabel: t('prefix'),
            uriPreview: t('uri-preview'),
          }}
        />
      </BlockContainer>

      <Separator isLarge />

      <BlockContainer>
        <WideMultiSelect
          chipListVisible={true}
          labelText={t('information-domains')}
          hintText={t('information-domains-hint-text')}
          visualPlaceholder={t('select-information-domains-for-data-model')}
          removeAllButtonLabel={t('clear-all-selections')}
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
          labelText={t('contributors')}
          hintText={t('contributors-hint-text')}
          visualPlaceholder={t('select-contributors')}
          removeAllButtonLabel={t('clear-all-selections')}
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
          translations={{
            email: t('email'),
            inputDescription1: t('contact-description-1'),
            inputDescription2: t('contact-description-2'),
            inputLabel: t('contact-input-label'),
            inputOptionLabel: t('contact-input-type-label'),
            inputPlaceholder: t('contact-input-placeholder'),
            label: t('feedback'),
            labelHint: t('contact-input-hint'),
            undefined: t('still-unknown'),
          }}
        />
      </BlockContainer>
    </Block>
  );
}
