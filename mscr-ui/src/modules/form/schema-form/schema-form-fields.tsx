/* eslint-disable */
import { useTranslation } from 'next-i18next';
import { Dropdown, DropdownItem } from 'suomifi-ui-components';
import { ModelFormContainer } from '../form.styles';
import LanguageSelector from 'yti-common-ui/components/form/language-selector';
import { FormErrors } from './validate-schema-form';
import { SchemaFormType } from '@app/common/interfaces/schema.interface';
import { Format } from '@app/common/interfaces/format.interface';
import { State } from '@app/common/interfaces/state.interface';
import MscrLanguageSelector from '@app/common/components/language-selector/mscr-language-selector';

interface SchemaFormProps {
  formData: SchemaFormType;
  setFormData: (value: SchemaFormType) => void;
  userPosted: boolean;
  disabled?: boolean;
  errors?: FormErrors;
  editMode?: boolean;
}

export default function SchemaFormFields({
  formData,
  setFormData,
  userPosted,
  disabled,
  errors,
}: // editMode,
SchemaFormProps) {
  const { t } = useTranslation();

  // Creating the actual schema Input form
  return (
    <ModelFormContainer>
      {renderSchemaFormat()}
      {renderLanguages()}
      {/*!editMode && renderContributors()*/}
      {renderStaus()}
      {/*editMode && renderContributors()*/}
    </ModelFormContainer>
  );

  function renderSchemaFormat() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Dropdown
          labelText={t('schema-form.format-label')}
          visualPlaceholder={t('schema-form.format-placeholder')}
          defaultValue={formData.format ?? ''}
          onChange={(e: Format) =>
            setFormData({
              ...formData,
              format: e,
            })
          }
        >
          <DropdownItem value={'CSV'}>{'CSV'}</DropdownItem>
          <DropdownItem value={'JSONSCHEMA'}>{'JSON'}</DropdownItem>
          <DropdownItem value={'PDF'}>{'PDF'}</DropdownItem>
          <DropdownItem value={'RDFS'}>{'RDFS'}</DropdownItem>
          <DropdownItem value={'SKOSRDF'}>{'SKOSRDF'}</DropdownItem>
          <DropdownItem value={'XML'}>{'XML'}</DropdownItem>
          <DropdownItem value={'XSD'}>{'XSD'}</DropdownItem>
	  <DropdownItem value={'SHACL'}>{'SHACL'}</DropdownItem>
        </Dropdown>
      </div>
    );
  }

  function renderLanguages() {
    // Languages that are available and that are selected by default are defined in
    // mscr-ui/src/common/utils/hooks/use-initial-schema-form.tsx
    return (
      <div>
        <MscrLanguageSelector
          items={formData.languages}
          labelText={t('schema-form.information-description-languages')}
          visualPlaceholder={t(
            'schema-form.information-description-languages-hint-text'
          )}
          isWide={true}
          setLanguages={(e) =>
            setFormData({
              ...formData,
              languages: e,
            })
          }
          userPosted={userPosted}
          translations={{
            textInput: t('schema-form.name'),
            textDescription: t('schema-form.description'),
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
          labelText={t('schema-form.status')}
          visualPlaceholder={t('schema-form.status-select')}
          defaultValue={''}
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

  // function renderContributors() {
  //   return (
  //     <WideMultiSelect
  //       chipListVisible={true}
  //       labelText={t('schema-form.contributors')}
  //       visualPlaceholder={t('schema-form.contributors-select')}
  //       removeAllButtonLabel={t(
  //         'schema-form.contributors-clear-all-selections'
  //       )}
  //       allowItemAddition={false}
  //       onItemSelectionsChange={(e) =>
  //         setFormData({
  //           ...formData,
  //           organizations: e,
  //         })
  //       }
  //       items={formData.organizations}
  //       status={
  //         'default'
  //         /* Old value below, can it be perma-removed? (leftover from https://github.com/CSCfi/mscr-ui-monorepo/pull/17)
  //                   {userPosted && errors?.organizations ? 'error' : 'default'}*/
  //       }
  //       ariaChipActionLabel={''}
  //       ariaSelectedAmountText={''}
  //       ariaOptionsAvailableText={''}
  //       ariaOptionChipRemovedText={''}
  //       noItemsText={''}
  //     />
  //   );
  // }
}
