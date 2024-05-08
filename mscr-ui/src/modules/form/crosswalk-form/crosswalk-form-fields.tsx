import { useTranslation } from 'next-i18next';
import { Dropdown, DropdownItem, Text, TextInput } from 'suomifi-ui-components';
import { FormErrors } from './validate-crosswalk-form';
import { CrosswalkFormType } from '@app/common/interfaces/crosswalk.interface';
import TargetAndSourceSchemaSelector from './target-and-source-schema-selector';
import {
  possibleStatesAtRegistration,
  State,
} from '@app/common/interfaces/state.interface';
import {
  ModelFormContainer,
  WideMultiSelect,
} from '@app/modules/form/form.styles';
import MscrLanguageSelector from '@app/common/components/language-selector/mscr-language-selector';
import {
  Format,
  formatsAvailableForCrosswalkCreation,
  formatsAvailableForCrosswalkRegistration,
} from '@app/common/interfaces/format.interface';

interface RegisterCrosswalkFormProps {
  formData: CrosswalkFormType;
  setFormData: (value: CrosswalkFormType) => void;
  createNew: boolean;
  isRevision?: boolean;
  userPosted: boolean;
  disabled?: boolean;
  errors?: FormErrors;
  editMode?: boolean;
}

export default function CrosswalkFormFields({
  formData,
  setFormData,
  createNew,
  isRevision,
  userPosted,
  disabled,
  errors,
  editMode,
}: RegisterCrosswalkFormProps) {
  const { t } = useTranslation('admin');

  return (
    <ModelFormContainer>
      <TargetAndSourceSchemaSelector
        formData={formData}
        setFormData={setFormData}
        createNew={createNew}
        schemaSelectorDisabled={isRevision}
      ></TargetAndSourceSchemaSelector>
      {createNew && (
        <Text>
          {t('crosswalk-form.format-note')}
          {formatsAvailableForCrosswalkCreation.join(', ')}
        </Text>
      )}
      {!createNew && renderCrosswalkFormat()}
      {renderLanguages()}
      {renderVersionLabel()}
      {!createNew && renderState()}
    </ModelFormContainer>
  );

  function renderCrosswalkFormat() {
    // may be load the formats from an array
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Dropdown
          labelText={'Format'}
          defaultValue={formData.format ?? ''}
          disabled={isRevision}
          visualPlaceholder={isRevision ? formData.format : 'Select Crosswalk File Format'}
          onChange={(e: Format) =>
            setFormData({
              ...formData,
              format: e,
            })
          }
        >
          {formatsAvailableForCrosswalkRegistration.map((format) => (
            <DropdownItem key={format} value={format}>
              {format}
            </DropdownItem>
          ))}
        </Dropdown>
      </div>
    );
  }

  function renderLanguages() {
    // Languages that are available and that are selected by default are defined in
    // mscr-ui/src/common/utils/hooks/use-initial-crosswalk-form.tsx
    return (
      <div>
        <MscrLanguageSelector
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

  function renderVersionLabel() {
    return (
      <TextInput
        labelText={t('crosswalk-form.version-label')}
        value={formData.versionLabel ?? '1'}
        onChange={(value) =>
          setFormData({
            ...formData,
            versionLabel: value as string,
          })
        }
      />
    );
  }

  function renderState() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Dropdown
          labelText={'State'}
          visualPlaceholder={'Select state'}
          defaultValue={formData.state ?? ''}
          disabled={isRevision}
          onChange={(e: State) =>
            setFormData({
              ...formData,
              state: e,
            })
          }
        >
          {possibleStatesAtRegistration.map((state) => (
            <DropdownItem key={state} value={state}>
              {state}
            </DropdownItem>
          ))}
        </Dropdown>
      </div>
    );
  }

  //Currently Hidden from the form
  // function renderContributors() {
  //   return (
  //     <WideMultiSelect
  //       chipListVisible={true}
  //       labelText={t('contributors')}
  //       hintText={t('contributors-hint-text')}
  //       visualPlaceholder={t('select-contributors')}
  //       removeAllButtonLabel={t('clear-all-selections')}
  //       allowItemAddition={false}
  //       onItemSelectionsChange={(e) =>
  //         setFormData({
  //           ...formData,
  //           organizations: e,
  //         })
  //       }
  //       items={formData.organizations}
  //       status={userPosted && errors?.organizations ? 'error' : 'default'}
  //       ariaChipActionLabel={''}
  //       ariaSelectedAmountText={''}
  //       ariaOptionsAvailableText={''}
  //       ariaOptionChipRemovedText={''}
  //       noItemsText={''}
  //     />
  //   );
  // }
}
