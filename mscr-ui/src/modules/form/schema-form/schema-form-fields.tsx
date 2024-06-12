/* eslint-disable */
import { useTranslation } from 'next-i18next';
import { DropdownItem } from 'suomifi-ui-components';
import { ModelFormContainer } from '../form.styles';
import {
  Format,
  formatsAvailableForSchemaRegistration,
} from '@app/common/interfaces/format.interface';
import { State } from '@app/common/interfaces/state.interface';
import MscrLanguageSelector from '@app/common/components/language-selector/mscr-language-selector';
import { WideDropdown } from '@app/modules/form/crosswalk-form/crosswalk-form.styles';
import { FormType } from '@app/common/utils/hooks/use-initial-form';
import { InputErrors } from '@app/modules/form/validate-form';

interface SchemaFormProps {
  formData: FormType;
  setFormData: (value: FormType) => void;
  userPosted: boolean;
  disabled?: boolean;
  errors?: InputErrors;
  editMode?: boolean;
  hasInitialData?: boolean;
}

export default function SchemaFormFields({
  formData,
  setFormData,
  userPosted,
  disabled,
  errors,
  hasInitialData,
}: // editMode,
SchemaFormProps) {
  const { t } = useTranslation();

  // Creating the actual schema Input form
  return (
    <ModelFormContainer>
      {renderLanguages()}
      {renderFormatAndState()}
      {/*editMode && renderContributors()*/}
    </ModelFormContainer>
  );

  function renderFormatAndState() {
    // may be load the formats from an array
    return (
      <>
        <div className="row">
          <div className="col-6">
            <WideDropdown
              labelText={t('content-form.format-label')}
              visualPlaceholder={
                hasInitialData
                  ? formData.format
                  : t('content-form.format-placeholder')
              }
              defaultValue={formData.format ?? ''}
              disabled={disabled || hasInitialData}
              onChange={(e: Format) =>
                setFormData({
                  ...formData,
                  format: e,
                })
              }
            >
              {formatsAvailableForSchemaRegistration.map((format) => (
                <DropdownItem key={format} value={format}>
                  {format}
                </DropdownItem>
              ))}
            </WideDropdown>
          </div>
          <div className="col-6">
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
            >
              <WideDropdown
                labelText={t('content-form.state')}
                visualPlaceholder={t('content-form.state-select')}
                defaultValue={State.Draft}
                disabled={disabled || hasInitialData}
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
              </WideDropdown>
            </div>
          </div>
        </div>
      </>
    );
  }

  function renderLanguages() {
    // Languages that are available and that are selected by default are defined in
    // mscr-ui/src/common/utils/hooks/use-initial-schema-form.tsx
    return (
      <div>
        <MscrLanguageSelector
          items={formData.languages}
          labelText={t('content-form.information-description-languages')}
          visualPlaceholder={t(
            'content-form.information-description-languages-hint-text'
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
            textDescription: t('content-form.description'),
            optionalText: t('content-form.optional'),
          }}
          versionLabelCaption={t('content-form.version-label')}
          versionLabel={formData.versionLabel ?? '1'}
          setVersionLabel={(e) => setVersionLabel(e)}
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

  function setVersionLabel(value: any) {
    setFormData({
      ...formData,
      versionLabel: value as string,
    });
  }
}
