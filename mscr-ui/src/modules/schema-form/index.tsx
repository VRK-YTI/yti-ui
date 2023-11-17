/* eslint-disable */
import { useGetOrganizationsQuery } from '@app/common/components/organizations/organizations.slice';
import { useGetServiceCategoriesQuery } from '@app/common/components/service-categories/service-categories.slice';
import getOrganizations from '@app/common/utils/get-organizations';
import getServiceCategories from '@app/common/utils/get-service-categories';
import { useTranslation } from 'next-i18next';
import { useMemo, useState } from 'react';
import { Dropdown, DropdownItem, Label, Text } from 'suomifi-ui-components';
import Separator from 'yti-common-ui/separator';
import {
  BlockContainer,
  ModelFormContainer,
  WideMultiSelect,
} from './schema-form.styles';
import LanguageSelector from 'yti-common-ui/form/language-selector';
import { FormErrors } from './validate-form';
import { Status } from '@app/common/interfaces/status.interface';
import { FormUpdateErrors } from './validate-form-update';
import {
  Schema,
  SchemaFormType,
} from '@app/common/interfaces/schema.interface';
import { TextInput } from 'suomifi-ui-components';
import { Paragraph } from 'suomifi-ui-components';
import UpdateWithFileModal from '@app/common/components/update-with-file-modal';
import { translateFileUploadError } from '@app/common/utils/translation-helpers copy';
import FileDropArea from 'yti-common-ui/file-drop-area';
import FileUpload from '@app/common/components/update-with-file-modal/file-upload';
import { ImportDescriptionBlock } from '@app/common/components/update-with-file-modal/update-with-file-modal.styles';
import { Format } from '@app/common/interfaces/format.interface';

interface SchemaFormProps {
  formData: SchemaFormType;
  setFormData: (value: SchemaFormType) => void;
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
    console.log(organizationsData[0].label);
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
      <BlockContainer>{!editMode && renderContributors()}</BlockContainer>
      {renderStaus()}
      {editMode && renderContributors()}
    </ModelFormContainer>
  );

  function renderSchemaFormat() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Dropdown
          labelText={'Format'}
          defaultValue={'JSONSCHEMA'}
          onChange={(e) =>
            setFormData({
              ...formData,
              format: e,
            })
          }
        >
          <DropdownItem value={'JSONSCHEMA'}>{'JSON'}</DropdownItem>
          <DropdownItem value={'CSV'}>{'CSV'}</DropdownItem>
        </Dropdown>
      </div>
    );
  }

  function renderLanguages() {
    return (
      <div>
        <LanguageSelector
          items={formData.languages}
          labelText={'Schema information-description-languages'}
          visualPlaceholder={'select schema information-description-languages'}
          isWide={true}
          setLanguages={(e) =>
            setFormData({
              ...formData,
              languages: e,
            })
          }
          userPosted={userPosted}
          translations={{
            textInput: 'Name(required)',
            textDescription: 'Description',
            optionalText: '',
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
            (lang: { selected: any }) => lang.selected
          )}
        />
      </div>
    );
  }

  function renderStaus() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Dropdown
          labelText={'Status'}
          defaultValue={'DRAFT'}
          onChange={(e) =>
            setFormData({
              ...formData,
              status: e as Status | undefined,
            })
          }
        >
          <DropdownItem value={'DRAFT'}>{'DRAFT'}</DropdownItem>
          <DropdownItem value={'PUBLISHED'}>{'PUBLISHED'}</DropdownItem>
          <DropdownItem value={'DEPRECATED'}>{'DEPRECATED'}</DropdownItem>
        </Dropdown>
      </div>
    );
  }

  function renderContributors() {
    return (
      <WideMultiSelect
        chipListVisible={true}
        labelText={'contributors'}
        visualPlaceholder={t('select-contributors')}
        removeAllButtonLabel={t('clear-all-selections')}
        allowItemAddition={false}
        onItemSelectionsChange={(e) =>
          setFormData({
            ...formData,
            organizations: e,
          })
        }
        items={formData.organizations}
        status={userPosted && errors?.organizations ? 'error' : 'default'}
        ariaChipActionLabel={''}
        ariaSelectedAmountText={''}
        ariaOptionsAvailableText={''}
        ariaOptionChipRemovedText={''}
        noItemsText={''}
      />
    );
  }
}
