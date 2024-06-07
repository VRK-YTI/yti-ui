import { useTranslation } from 'next-i18next';
import { DropdownItem, Text } from 'suomifi-ui-components';
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
import { FormType } from '@app/common/utils/hooks/use-initial-form';
import { InputErrors } from '@app/modules/form/validate-form';

interface RegisterCrosswalkFormProps {
  formData: FormType;
  setFormData: (value: FormType) => void;
  createNew: boolean;
  hasInitialData?: boolean;
  userPosted: boolean;
  disabled?: boolean;
  errors?: InputErrors;
  editMode?: boolean;
  groupWorkspacePid: string | undefined;
}

export default function CrosswalkFormFields({
  formData,
  setFormData,
  createNew,
  hasInitialData,
  userPosted,
  disabled,
  errors,
  groupWorkspacePid,
}: RegisterCrosswalkFormProps) {
  const { t } = useTranslation();

  return (
    <ModelFormContainer>
      <TargetAndSourceSchemaSelector
        formData={formData}
        setFormData={setFormData}
        createNew={createNew}
        schemaSelectorDisabled={hasInitialData}
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
              disabled={hasInitialData}
              labelText={t('content-form.format-label')}
              defaultValue={formData.format ?? ''}
              visualPlaceholder={
                hasInitialData
                  ? formData.format
                  : t('content-form.format-placeholder')
              }
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
              disabled={hasInitialData}
              labelText={t('content-form.state')}
              visualPlaceholder={t('content-form.state-select')}
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
          labelText={t('content-form.information-description-languages')}
          hintText={t(
            'content-form.information-description-languages-hint-text'
          )}
          visualPlaceholder={t(
            'content-form.information-description-languages-placeholder'
          )}
          isWide={true}
          setLanguages={(e) =>
            setFormData({
              ...formData,
              languages: e,
            })
          }
          versionLabelCaption={t('content-form.version-label')}
          versionLabel={formData.versionLabel ?? '1'}
          setVersionLabel={(e) => setVersionLabel(e)}
          userPosted={userPosted}
          translations={{
            textInput: t('crosswalk-form.name'),
            textDescription: t('content-form.description'),
            optionalText: t('content-form.optional'),
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
