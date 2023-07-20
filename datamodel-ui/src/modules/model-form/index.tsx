import { useGetOrganizationsQuery } from '@app/common/components/organizations/organizations.slice';
import { useGetServiceCategoriesQuery } from '@app/common/components/service-categories/service-categories.slice';
import getOrganizations from '@app/common/utils/get-organizations';
import getServiceCategories from '@app/common/utils/get-service-categories';
import { useTranslation } from 'next-i18next';
import { useEffect, useMemo, useState } from 'react';
import {
  Dropdown,
  DropdownItem,
  Label,
  RadioButton,
  RadioButtonGroup,
  Text,
} from 'suomifi-ui-components';
import Separator from 'yti-common-ui/separator';
import {
  BlockContainer,
  ModelFormContainer,
  WideMultiSelect,
} from './model-form.styles';
import LanguageSelector, {
  LanguageBlockType,
} from 'yti-common-ui/form/language-selector';
import Prefix from 'yti-common-ui/form/prefix';
import Contact from 'yti-common-ui/form/contact';
import { useGetModelExistsMutation } from '@app/common/components/prefix/prefix.slice';
import { ModelFormType } from '@app/common/interfaces/model-form.interface';
import { FormErrors } from './validate-form';
import AddBlock from './add-block';
import { Status } from '@app/common/interfaces/status.interface';
import { FormUpdateErrors } from '../model/validate-form-update';
import { useGetLanguagesQuery } from '@app/common/components/code/code.slice';

interface ModelFormProps {
  formData: ModelFormType;
  setFormData: (value: ModelFormType) => void;
  userPosted: boolean;
  disabled?: boolean;
  errors?: FormErrors | FormUpdateErrors;
  editMode?: boolean;
}

export default function ModelForm({
  formData,
  setFormData,
  userPosted,
  disabled,
  errors,
  editMode,
}: ModelFormProps) {
  const { t, i18n } = useTranslation('admin');
  const { data: serviceCategoriesData } = useGetServiceCategoriesQuery(
    i18n.language
  );
  const { data: organizationsData } = useGetOrganizationsQuery(i18n.language);
  const { data: languages, isSuccess } = useGetLanguagesQuery();
  const [languageList, setLanguageList] = useState<LanguageBlockType[]>([]);

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

  useEffect(() => {
    if (isSuccess && languageList.length === 0) {
      const selectedLangCodes =
        formData.languages.map((d) => d.uniqueItemId) ?? [];

      const langResult = languages?.results.map((r) => {
        const labelText = `${
          r.prefLabel[i18n.language]
        } ${r.codeValue.toUpperCase()}`;

        if (selectedLangCodes.includes(r.codeValue)) {
          const selectedLang = formData.languages?.find(
            (d) => d.uniqueItemId === r.codeValue
          );
          return {
            labelText,
            uniqueItemId: r.codeValue,
            title: selectedLang?.title ?? '',
            description: selectedLang?.description ?? '',
            selected: true,
          };
        } else {
          return {
            labelText,
            uniqueItemId: r.codeValue,
            title: '',
            description: '',
            selected: false,
          };
        }
      });

      if (langResult) {
        const promotedOrder = ['fi', 'sv', 'en'];
        const promoted: LanguageBlockType[] = [];
        const otherLanguages = langResult.reduce((langList, lang) => {
          promotedOrder.includes(lang.uniqueItemId)
            ? promoted.push(lang)
            : langList.push(lang);
          return langList;
        }, [] as LanguageBlockType[]);

        promoted.sort(
          (a, b) =>
            promotedOrder.indexOf(a.uniqueItemId) -
            promotedOrder.indexOf(b.uniqueItemId)
        );
        setLanguageList([...promoted, ...otherLanguages]);
      }
    }
  }, [
    languages,
    languageList.length,
    isSuccess,
    i18n.language,
    formData.languages,
  ]);

  return (
    <ModelFormContainer>
      {renderModelType()}
      {renderLanguages()}
      {renderPrefix()}

      <BlockContainer>
        {renderInformationDomains()}
        {renderUsedBlock()}
        {!editMode && renderContributors()}
      </BlockContainer>

      <Separator isLarge />
      {editMode && renderContributors()}
      {renderContact()}
    </ModelFormContainer>
  );

  function renderModelType() {
    if (editMode) {
      return <></>;
    }

    return (
      <>
        <RadioButtonGroup
          labelText={t('datamodel-type')}
          name="type"
          defaultValue="PROFILE"
          id="model-type-group"
          onChange={(e) =>
            setFormData({ ...formData, type: e as 'PROFILE' | 'LIBRARY' })
          }
        >
          <RadioButton
            value="PROFILE"
            hintText={t('profile-hint-text')}
            id="profile-radio-button"
            disabled={disabled}
          >
            {t('profile', { ns: 'common' })}
          </RadioButton>
          <RadioButton
            value="LIBRARY"
            hintText={t('library-hint-text')}
            id="library-radio-button"
            disabled={disabled}
          >
            {t('library', { ns: 'common' })}
          </RadioButton>
        </RadioButtonGroup>

        <Separator />
      </>
    );
  }

  function renderLanguages() {
    return (
      <div>
        <LanguageSelector
          items={languageList}
          labelText={t('information-description-languages')}
          hintText={t('information-description-languages-hint-text')}
          visualPlaceholder={t('select-information-description-languages')}
          isWide={true}
          setLanguages={(e) => {
            const selectedItems = e.filter((v) => v.selected);
            const selectedIds = selectedItems.map((i) => i.uniqueItemId);
            const updatedList = languageList.map((item) => {
              if (selectedIds.includes(item.uniqueItemId)) {
                const selected = selectedItems.find(
                  (v) => v.uniqueItemId === item.uniqueItemId
                );
                return {
                  ...item,
                  title: selected?.title ?? '',
                  description: selected?.description ?? '',
                  selected: true,
                };
              }
              return {
                ...item,
                selected: false,
              };
            });

            setLanguageList(updatedList);
            setFormData({
              ...formData,
              languages: selectedItems,
            });
          }}
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
          disabled={disabled}
          defaultSelectedItems={formData.languages.filter(
            (lang) => lang.selected
          )}
        />
      </div>
    );
  }

  function renderPrefix() {
    if (editMode) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <Label>{t('prefix')}</Label>
            <Text smallScreen>{formData.prefix}</Text>
          </div>
          <div>
            <Label>{t('namespace')}</Label>
            <Text
              smallScreen
            >{`http://uri.suomi.fi/datamodel/ns/${formData.prefix}`}</Text>
          </div>

          <Dropdown
            labelText={t('status')}
            defaultValue={formData.status ?? ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                status: e as Status | undefined,
              })
            }
            id="status-dropdown"
          >
            <DropdownItem value={'DRAFT'}>
              {t('statuses.draft', { ns: 'common' })}
            </DropdownItem>
            <DropdownItem value={'VALID'}>
              {t('statuses.valid', { ns: 'common' })}
            </DropdownItem>
            <DropdownItem value={'SUPERSEDED'}>
              {t('statuses.superseded', { ns: 'common' })}
            </DropdownItem>
            <DropdownItem value={'RETIRED'}>
              {t('statuses.retired', { ns: 'common' })}
            </DropdownItem>
            <DropdownItem value={'INVALID'}>
              {t('statuses.invalid', { ns: 'common' })}
            </DropdownItem>
          </Dropdown>
        </div>
      );
    }

    const errorInPrefix = () => {
      if (!errors || !('prefix' in errors)) {
        return false;
      }

      return errors.prefix || errors.prefixInitChar || errors.prefixLength;
    };

    return (
      <>
        <Prefix
          prefix={formData.prefix}
          setPrefix={(e) =>
            setFormData({
              ...formData,
              prefix: e,
            })
          }
          inUseMutation={useGetModelExistsMutation}
          typeInUri={'datamodel/ns'}
          error={errorInPrefix()}
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
          disabled={disabled}
          noAuto
          fullWidth
        />
        <Separator />
      </>
    );
  }

  function renderInformationDomains() {
    return (
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
        disabled={disabled}
        defaultSelectedItems={formData.serviceCategories}
        id="information-domains-selector"
      />
    );
  }

  function renderContributors() {
    return (
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
        defaultSelectedItems={formData.organizations}
        id="contributors-selector"
      />
    );
  }

  function renderUsedBlock() {
    if (!editMode) {
      return <></>;
    }
    return (
      <AddBlock
        data={formData}
        locale={i18n.language}
        setTerminologies={(terminologies) =>
          setFormData({
            ...formData,
            terminologies,
          })
        }
      />
    );
  }

  function renderContact() {
    return (
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
          optional: t('optional'),
          undefined: t('still-unknown'),
        }}
        error={errors?.contact}
        disabled={disabled}
      />
    );
  }
}
