import { useGetOrganizationsQuery } from '@app/common/components/organizations/organizations.slice';
import getOrganizations from '@app/common/utils/get-organizations';
import { useTranslation } from 'next-i18next';
import { useMemo } from 'react';
import { Dropdown, DropdownItem } from 'suomifi-ui-components';
import { ModelFormContainer, WideMultiSelect } from './crosswalk-form.styles';
import LanguageSelector from 'yti-common-ui/form/language-selector';
import { FormErrors } from '../form/validate-crosswalk-form';
import { Status } from '@app/common/interfaces/status.interface';
import { CrosswalkFormType } from '@app/common/interfaces/crosswalk.interface';
// ToDo: Do something about the import below if it's still from old-schema-form
import { FormUpdateErrors } from '@app/modules/old-schema-form/validate-form-update';
import CrosswalkForm from '../create-crosswalk';
import { State } from '@app/common/interfaces/state.interface';

interface RegisterCrosswalkFormProps {
  formData: CrosswalkFormType;
  setFormData: (value: {
    targetSchema: string;
    versionLabel?: string;
    languages: any;
    format: any;
    organizations: any;
    namespace?: string;
    description?: any;
    pid?: string;
    label: any;
    state: string;
    sourceSchema: string;
    status?: string | undefined;
  }) => void;
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
  const { t } = useTranslation('admin');

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
      {renderStaus()}
    </ModelFormContainer>
  );

  function renderCrosswalkFormat() {
    // may be load the formats from an array
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Dropdown
          labelText={'Format'}
          defaultValue={formData.format ?? ''}
          visualPlaceholder={'Select Crosswalk File Format'}
          onChange={(e) =>
            setFormData({
              ...formData,
              format: e,
            })
          }
        >
          <DropdownItem value={'XSLT'}>{'XSLT'}</DropdownItem>
          <DropdownItem value={'CSV'}>{'CSV'}</DropdownItem>
          <DropdownItem value={'PDF'}>{'PDF'}</DropdownItem>
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
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Dropdown
          labelText={'Status'}
          visualPlaceholder={'Select Status'}
          defaultValue={formData.status ?? ''}
          onChange={(e) =>
            setFormData({
              ...formData,
              state: e as State,
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

  //Currently Hidden from the form
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
