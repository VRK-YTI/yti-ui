import { useTranslation } from 'next-i18next';
import { DropdownItem, Text } from 'suomifi-ui-components';
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
import { WideDropdown } from '@app/modules/form/crosswalk-form/crosswalk-form.styles';

interface RegisterCrosswalkFormProps {
  formData: CrosswalkFormType;
  setFormData: (value: CrosswalkFormType) => void;
  createNew: boolean;
  isRevision?: boolean;
  userPosted: boolean;
  disabled?: boolean;
  errors?: FormErrors;
  editMode?: boolean;
  groupWorkspacePid: string | undefined;
}

export default function CrosswalkFormFields({
  formData,
  setFormData,
  createNew,
  isRevision,
  userPosted,
  disabled,
  errors, groupWorkspacePid

}: RegisterCrosswalkFormProps) {
  const { t } = useTranslation('admin');

  return (
    <ModelFormContainer>
      <TargetAndSourceSchemaSelector
        formData={formData}
        setFormData={setFormData}
        createNew={createNew}
        schemaSelectorDisabled={isRevision}
        groupWorkspacePid={groupWorkspacePid}
      ></TargetAndSourceSchemaSelector>
      {createNew && (
        <Text>
          {t('crosswalk-form.format-note')}
          {formatsAvailableForCrosswalkCreation.join(', ')}
        </Text>
      )}
      {renderLanguages()}
      {!createNew && renderCrosswalkFormatAndState()}
    </ModelFormContainer>
  );

  function renderCrosswalkFormatAndState() {
    // may be load the formats from an array
    return (
      <>
        <div className="row">
          <div className="col-6">
            <WideDropdown
              disabled={isRevision}
              labelText={'Format'}
              defaultValue={formData.format ?? ''}
              visualPlaceholder={'Select Crosswalk File Format'}
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
            </WideDropdown>
          </div>
          <div className="col-6">
            <WideDropdown
              disabled={isRevision}
              labelText={'State'}
              visualPlaceholder={'Select state'}
              defaultValue={formData.state ?? ''}
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
            </WideDropdown>
          </div>
        </div>
      </>
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
          versionLabelCaption={t('crosswalk-form.version-label')}
          versionLabel={formData.versionLabel ?? '1'}
          setVersionLabel={(e) => setVersionLabel(e)}
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

  function setVersionLabel(value: string) {
    setFormData({
      ...formData,
      versionLabel: value as string,
    });
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
