/* eslint-disable */
import { useTranslation } from 'next-i18next';
import { DropdownItem } from 'suomifi-ui-components';
import { ModelFormContainer } from '../form.styles';
import { FormErrors } from './validate-schema-form';
import { SchemaFormType } from '@app/common/interfaces/schema.interface';
import {
  Format,
  formatsAvailableForSchemaRegistration,
} from '@app/common/interfaces/format.interface';
import { State } from '@app/common/interfaces/state.interface';
import MscrLanguageSelector from '@app/common/components/language-selector/mscr-language-selector';
import { WideDropdown } from '@app/modules/form/crosswalk-form/crosswalk-form.styles';

interface SchemaFormProps {
  formData: SchemaFormType;
  setFormData: (value: SchemaFormType) => void;
  userPosted: boolean;
  disabled?: boolean;
  errors?: FormErrors;
  editMode?: boolean;
  isRevision?: boolean;
}

export default function SchemaFormFields({
  formData,
  setFormData,
  userPosted,
  disabled,
  errors,
  isRevision,
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
              labelText={t('schema-form.format-label')}
              visualPlaceholder={
                isRevision
                  ? formData.format
                  : t('schema-form.format-placeholder')
              }
              defaultValue={formData.format ?? ''}
              disabled={disabled || isRevision}
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
                labelText={t('schema-form.status')}
                visualPlaceholder={t('schema-form.status-select')}
                defaultValue={State.Draft}
                disabled={disabled || isRevision}
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
          versionLabelCaption={t('schema-form.version-label')}
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
