import { useGetOrganizationsQuery } from '@app/common/components/organizations/organizations.slice';
import { useGetServiceCategoriesQuery } from '@app/common/components/service-categories/service-categories.slice';
import getOrganizations from '@app/common/utils/get-organizations';
import getServiceCategories from '@app/common/utils/get-service-categories';
import { useTranslation } from 'next-i18next';
import { useMemo } from 'react';
import { Dropdown, DropdownItem, Label, Text } from 'suomifi-ui-components';
import Separator from 'yti-common-ui/separator';
import {
  BlockContainer,
  ModelFormContainer,
  WideMultiSelect,
} from './schema-form.styles';
import LanguageSelector from 'yti-common-ui/form/language-selector';
import Prefix from 'yti-common-ui/form/prefix';
import { useGetFreePrefixMutation } from '@app/common/components/prefix';
import { FormErrors } from './validate-form';
import AddBlock from './add-block';
import { Status } from '@app/common/interfaces/status.interface';
import { FormUpdateErrors } from './validate-form-update';
import { Schema } from '@app/common/interfaces/schema.interface';
import { TextInput } from 'suomifi-ui-components';

interface SchemaProps {
  pid: string;
}
interface SchemaFormProps {
  formData: Schema;
  setFormData: (value: Schema) => void;
  userPosted: boolean;
  disabled?: boolean;
  errors?: FormErrors | FormUpdateErrors;
  editMode?: boolean;
}

export default function SchemaForm({
  formData,
  setFormData,
  userPosted,
  disabled,
  errors,
  editMode,
}: SchemaFormProps) {
  const { t, i18n } = useTranslation('schema');
  const { data: serviceCategoriesData } = useGetServiceCategoriesQuery(
    i18n.language
  );
  const { data: organizationsData } = useGetOrganizationsQuery(i18n.language);

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

  // Creating the actual schema Input form
  return (
    <ModelFormContainer>
      {renderSchemaFormat()}
      {renderLanguages()}

      <BlockContainer>
        {renderUsedBlock()}
        {!editMode && renderContributors()}
      </BlockContainer>

      <Separator isLarge />
      {renderStaus()}
      {editMode && renderContributors()}
    </ModelFormContainer>
  );

  function renderSchemaFormat() {
    return (
      <div>
        <TextInput labelText={'Format'} />
      </div>
    );
  }

  function renderLanguages() {
    return (
      <div>
        <LanguageSelector
          items={formData.languages}
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
          disabled={disabled}
          defaultSelectedItems={formData.languages.filter(
            (lang) => lang.selected
          )}
        />
      </div>
    );
  }

  function renderStaus() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Dropdown
          labelText={'Tila'}
          defaultValue={formData.status ?? ''}
          onChange={(e) =>
            setFormData({
              ...formData,
              status: e as Status | undefined,
            })
          }
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
}
