import { useGetLanguagesQuery } from '@app/common/components/code/code.slice';
import InlineListBlock from '@app/common/components/inline-list-block';
import { ResourceFormType } from '@app/common/interfaces/resource-form.interface';
import { ResourceType } from '@app/common/interfaces/resource-type.interface';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import CodeListModal from '@app/modules/code-list-modal';
import { compareLocales } from '@app/common/utils/compare-locals';
import { useTranslation } from 'next-i18next';
import {
  MultiSelect,
  SingleSelect,
  Text,
  TextInput,
} from 'suomifi-ui-components';
import Separator from 'yti-common-ui/separator';
import { CommonFormErrors } from '../validate-form';

export default function AttributeRestrictions({
  data,
  errors,
  applicationProfile,
  handleUpdate,
}: {
  data: ResourceFormType;
  errors: CommonFormErrors;
  applicationProfile?: boolean;
  handleUpdate: (
    key: keyof ResourceFormType,
    value: ResourceFormType[typeof key]
  ) => void;
}) {
  const { t, i18n } = useTranslation('admin');
  const { data: languages } = useGetLanguagesQuery();

  if (data.type !== ResourceType.ATTRIBUTE || !applicationProfile) {
    return <></>;
  }

  return (
    <>
      <Separator />

      <div style={{ marginBottom: '10px' }}>
        <Text variant="bold">{t('restrictions')}</Text>
      </div>

      <InlineListBlock
        addNewComponent={
          <CodeListModal
            initialData={[]}
            extendedView
            modalTitle={t('add-reference-data')}
            setData={(value) =>
              handleUpdate(
                'codeLists',
                value.map((v) => ({
                  id: v.id,
                  label: v.prefLabel,
                }))
              )
            }
          />
        }
        handleRemoval={(id) =>
          handleUpdate(
            'codeLists',
            data.codeLists?.filter((cl) => cl.id !== id) ?? []
          )
        }
        items={
          data.codeLists?.map((cl) => ({
            id: cl.id,
            label: getLanguageVersion({
              data: cl.label,
              lang: i18n.language,
              appendLocale: true,
            }),
          })) ?? []
        }
        label={t('codelist')}
      />

      <MultiSelect
        labelText={t('allowed-values')}
        itemAdditionHelpText=""
        ariaOptionsAvailableText=""
        ariaOptionChipRemovedTextFunction={() => ''}
        ariaSelectedAmountTextFunction={() => ''}
        optionalText={t('optional')}
        visualPlaceholder={t('select-values')}
        items={
          data.allowedValues
            ? data.allowedValues.map((av) => ({
                labelText: av,
                uniqueItemId: av,
              }))
            : []
        }
        defaultSelectedItems={
          data.allowedValues
            ? data.allowedValues.map((av) => ({
                labelText: av,
                uniqueItemId: av,
              }))
            : []
        }
        allowItemAddition
        chipListVisible
        onItemSelectionsChange={(e) =>
          handleUpdate('allowedValues', e.map((val) => val.uniqueItemId) ?? '')
        }
      />

      <SingleSelect
        labelText={t('default-value')}
        clearButtonLabel=""
        itemAdditionHelpText=""
        ariaOptionsAvailableText=""
        items={
          data.allowedValues
            ? data.allowedValues.map((av) => ({
                labelText: av,
                uniqueItemId: av,
              }))
            : []
        }
        defaultSelectedItem={
          data.defaultValue
            ? {
                labelText: data.defaultValue,
                uniqueItemId: data.defaultValue,
              }
            : undefined
        }
        optionalText={t('optional')}
        visualPlaceholder={t('select-value')}
        allowItemAddition
        onItemSelect={(e) => handleUpdate('defaultValue', e ?? '')}
      />

      <SingleSelect
        labelText={t('required-value')}
        clearButtonLabel=""
        itemAdditionHelpText=""
        ariaOptionsAvailableText=""
        items={
          data.allowedValues
            ? data.allowedValues.map((av) => ({
                labelText: av,
                uniqueItemId: av,
              }))
            : []
        }
        defaultSelectedItem={
          data.hasValue
            ? {
                labelText: data.hasValue,
                uniqueItemId: data.hasValue,
              }
            : undefined
        }
        optionalText={t('optional')}
        visualPlaceholder={t('select-value')}
        allowItemAddition
        onItemSelect={(e) => handleUpdate('hasValue', e ?? '')}
      />

      <TextInput
        labelText={t('minimum-length')}
        optionalText={t('optional')}
        visualPlaceholder={t('input-value')}
        defaultValue={data.minLength}
        onChange={(e) => handleUpdate('minLength', e?.toString() ?? '')}
        status={errors['minLength'] ? 'error' : 'default'}
      />

      <TextInput
        labelText={t('maximum-length')}
        optionalText={t('optional')}
        visualPlaceholder={t('input-value')}
        defaultValue={data.maxLength}
        onChange={(e) => handleUpdate('maxLength', e?.toString() ?? '')}
        status={errors['maxLength'] ? 'error' : 'default'}
      />

      <TextInput
        labelText={t('minimum-amount')}
        optionalText={t('optional')}
        visualPlaceholder={t('input-value')}
        defaultValue={data.minCount}
        onChange={(e) => handleUpdate('minCount', e?.toString() ?? '')}
        status={errors['minCount'] ? 'error' : 'default'}
      />

      <TextInput
        labelText={t('maximum-amount')}
        optionalText={t('optional')}
        visualPlaceholder={t('input-value')}
        defaultValue={data.maxCount}
        onChange={(e) => handleUpdate('maxCount', e?.toString() ?? '')}
        status={errors['maxCount'] ? 'error' : 'default'}
      />

      <TextInput
        labelText={t('larger-or-as-large-as')}
        optionalText={t('optional')}
        visualPlaceholder={t('input-value')}
        defaultValue={data.minInclusive}
        onChange={(e) => handleUpdate('minInclusive', e?.toString() ?? '')}
        status={errors['minInclusive'] ? 'error' : 'default'}
      />

      <TextInput
        labelText={t('smaller-or-as-small-as')}
        optionalText={t('optional')}
        visualPlaceholder={t('input-value')}
        defaultValue={data.maxInclusive}
        onChange={(e) => handleUpdate('maxInclusive', e?.toString() ?? '')}
        status={errors['maxInclusive'] ? 'error' : 'default'}
      />

      <TextInput
        labelText={t('larger-than')}
        optionalText={t('optional')}
        visualPlaceholder={t('input-value')}
        defaultValue={data.minExclusive}
        onChange={(e) => handleUpdate('minExclusive', e?.toString() ?? '')}
        status={errors['minExclusive'] ? 'error' : 'default'}
      />

      <TextInput
        labelText={t('smaller-than')}
        optionalText={t('optional')}
        visualPlaceholder={t('input-value')}
        defaultValue={data.maxExclusive}
        onChange={(e) => handleUpdate('maxExclusive', e?.toString() ?? '')}
        status={errors['maxExclusive'] ? 'error' : 'default'}
      />

      <TextInput
        labelText={t('string-attribute-format')}
        optionalText={t('optional')}
        visualPlaceholder={t('input-value')}
        defaultValue={data.pattern}
        onChange={(e) => handleUpdate('pattern', e?.toString() ?? '')}
      />

      <MultiSelect
        labelText={t('string-attribute-languages')}
        visualPlaceholder={t('select-languages')}
        optionalText={t('optional')}
        allowItemAddition={false}
        ariaChipActionLabel={''}
        ariaSelectedAmountText={''}
        ariaOptionsAvailableText={''}
        ariaOptionChipRemovedText={''}
        noItemsText={''}
        chipListVisible={true}
        status={'default'}
        items={
          languages
            ? [...languages.results]
                .sort((a, b) => compareLocales(a.codeValue, b.codeValue))
                .map((l) => {
                  const label = getLanguageVersion({
                    data: l.prefLabel,
                    lang: i18n.language,
                  });
                  return {
                    name: label,
                    labelText: label,
                    uniqueItemId: l.codeValue,
                  };
                })
            : []
        }
        defaultSelectedItems={
          data.languageIn && data.languageIn.length > 0
            ? languages
              ? languages.results
                  .filter((l) =>
                    (data.languageIn as string[]).includes(l.codeValue)
                  )
                  .map((l) => {
                    const label = getLanguageVersion({
                      data: l.prefLabel,
                      lang: i18n.language,
                    });
                    return {
                      name: label,
                      labelText: label,
                      uniqueItemId: l.codeValue,
                    };
                  })
              : []
            : []
        }
        onItemSelectionsChange={(value) =>
          handleUpdate(
            'languageIn',
            value.map((v) => v.uniqueItemId)
          )
        }
      />

      <Separator />
    </>
  );
}
