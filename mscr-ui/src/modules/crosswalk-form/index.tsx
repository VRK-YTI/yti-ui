import { useGetOrganizationsQuery } from '@app/common/components/organizations/organizations.slice';
import { useGetServiceCategoriesQuery } from '@app/common/components/service-categories/service-categories.slice';
import getOrganizations from '@app/common/utils/get-organizations';
import getServiceCategories from '@app/common/utils/get-service-categories';
import { useTranslation } from 'next-i18next';
import { useMemo, useState } from 'react';
import { Dropdown, DropdownItem, TextInput } from 'suomifi-ui-components';
import Separator from 'yti-common-ui/separator';
import {
  BlockContainer,
  ModelFormContainer,
  WideMultiSelect,
} from './crosswalk-form.styles';
import LanguageSelector from 'yti-common-ui/form/language-selector';
import { FormErrors } from './validate-form';
import { Status } from '@app/common/interfaces/status.interface';
import { CrosswalkFormType } from '@app/common/interfaces/crosswalk.interface';
import { FormUpdateErrors } from '../schema-form/validate-form-update';
import { translateFileUploadError } from '@app/common/utils/translation-helpers copy';
import FileDropArea from 'yti-common-ui/file-drop-area';
import CrosswalkForm from '../create-crosswalk';

interface RegisterCrosswalkFormProps {
  formData: CrosswalkFormType;
  setFormData: (value: CrosswalkFormType) => void;
  userPosted: boolean;
  disabled?: boolean;
  errors?: FormErrors | FormUpdateErrors;
  editMode?: boolean;
}

export default function RegisterCrosswalkForm({
  formData,
  setFormData,
  userPosted,
  disabled,
  errors,
  editMode,
}: RegisterCrosswalkFormProps) {
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
    <ModelFormContainer>
      <CrosswalkForm
        formData={formData}
        setFormData={setFormData}
        userPosted={userPosted}
        errors={userPosted ? errors : undefined}
      ></CrosswalkForm>
      {renderCrosswalkFormat()}
      {renderLanguages()}
      <BlockContainer>{!editMode && renderContributors()}</BlockContainer>
      <Separator isLarge />
      {editMode && renderContributors()}
      {renderStaus()}
    </ModelFormContainer>
  );

  function renderCrosswalkFormat() {
    // may be load the formats from an array
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Dropdown
          labelText={'Format'}
          defaultValue={'CSV'}
          onChange={(e) =>
            setFormData({
              ...formData,
              format: e,
            })
          }
        >
          <DropdownItem value={'XSLT'}>{'XSLT'}</DropdownItem>
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
    if (editMode) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Dropdown
            labelText={'Status'}
            defaultValue={formData.status ?? ''}
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
