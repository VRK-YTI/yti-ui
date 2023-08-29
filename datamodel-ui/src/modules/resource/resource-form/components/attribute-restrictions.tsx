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
import { TEXT_INPUT_MAX } from 'yti-common-ui/utils/constants';
import styled from 'styled-components';

const RestrictionWrapper = styled.div`
  > * {
    margin-bottom: 20px;
    width: 100%;

    .fi-text-input_input-element-container {
      width: 290px;
    }

    .fi-filter-input_functionalityContainer {
      width: 290px;
    }
  }
`;

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

      <RestrictionWrapper>
        <InlineListBlock
          addNewComponent={
            <CodeListModal
              extendedView
              modalTitle={t('add-reference-data')}
              initialData={data.codeLists ?? []}
              setData={(value) =>
                handleUpdate(
                  'codeLists',
                  value.map((v) => ({
                    id: v.id,
                    prefLabel: v.prefLabel,
                    status: v.status,
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
                data: cl.prefLabel,
                lang: i18n.language,
                appendLocale: true,
              }),
            })) ?? []
          }
          label={t('codelist')}
        />

        <MultiSelect
          labelText={`${t('allowed-values')} (sh:in)`}
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
            handleUpdate(
              'allowedValues',
              e.map((val) => val.uniqueItemId) ?? ''
            )
          }
        />

        <SingleSelect
          labelText={`${t('default-value')} (sh:defaultValue)`}
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
          labelText={`${t('required-value')} (sh:hasValue)`}
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
          labelText={`${t('minimum-length')} (sh:minLength)`}
          optionalText={t('optional')}
          visualPlaceholder={t('input-value')}
          defaultValue={data.minLength}
          onChange={(e) => handleUpdate('minLength', e?.toString() ?? '')}
          status={errors['minLength'] ? 'error' : 'default'}
          maxLength={TEXT_INPUT_MAX}
        />

        <TextInput
          labelText={`${t('maximum-length')} (sh:maxLength)`}
          optionalText={t('optional')}
          visualPlaceholder={t('input-value')}
          defaultValue={data.maxLength}
          onChange={(e) => handleUpdate('maxLength', e?.toString() ?? '')}
          status={errors['maxLength'] ? 'error' : 'default'}
          maxLength={TEXT_INPUT_MAX}
        />

        <TextInput
          labelText={`${t('minimum-amount')} (sh:minCount)`}
          optionalText={t('optional')}
          visualPlaceholder={t('input-value')}
          defaultValue={data.minCount}
          onChange={(e) => handleUpdate('minCount', e?.toString() ?? '')}
          status={errors['minCount'] ? 'error' : 'default'}
          maxLength={TEXT_INPUT_MAX}
        />

        <TextInput
          labelText={`${t('maximum-amount')} (sh:maxCount)`}
          optionalText={t('optional')}
          visualPlaceholder={t('input-value')}
          defaultValue={data.maxCount}
          onChange={(e) => handleUpdate('maxCount', e?.toString() ?? '')}
          status={errors['maxCount'] ? 'error' : 'default'}
          maxLength={TEXT_INPUT_MAX}
        />

        <TextInput
          labelText={`${t('larger-or-as-large-as')} (sh:minInclusive)`}
          optionalText={t('optional')}
          visualPlaceholder={t('input-value')}
          defaultValue={data.minInclusive}
          onChange={(e) => handleUpdate('minInclusive', e?.toString() ?? '')}
          status={errors['minInclusive'] ? 'error' : 'default'}
          maxLength={TEXT_INPUT_MAX}
        />

        <TextInput
          labelText={`${t('smaller-or-as-small-as')} (sh:maxInclusive)`}
          optionalText={t('optional')}
          visualPlaceholder={t('input-value')}
          defaultValue={data.maxInclusive}
          onChange={(e) => handleUpdate('maxInclusive', e?.toString() ?? '')}
          status={errors['maxInclusive'] ? 'error' : 'default'}
          maxLength={TEXT_INPUT_MAX}
        />

        <TextInput
          labelText={`${t('larger-than')} (sh:minExclusive)`}
          optionalText={t('optional')}
          visualPlaceholder={t('input-value')}
          defaultValue={data.minExclusive}
          onChange={(e) => handleUpdate('minExclusive', e?.toString() ?? '')}
          status={errors['minExclusive'] ? 'error' : 'default'}
          maxLength={TEXT_INPUT_MAX}
        />

        <TextInput
          labelText={`${t('smaller-than')} (sh:maxExclusive)`}
          optionalText={t('optional')}
          visualPlaceholder={t('input-value')}
          defaultValue={data.maxExclusive}
          onChange={(e) => handleUpdate('maxExclusive', e?.toString() ?? '')}
          status={errors['maxExclusive'] ? 'error' : 'default'}
          maxLength={TEXT_INPUT_MAX}
        />

        <TextInput
          labelText={`${t('string-attribute-format')} (sh:pattern)`}
          optionalText={t('optional')}
          visualPlaceholder={t('input-value')}
          defaultValue={data.pattern}
          onChange={(e) => handleUpdate('pattern', e?.toString() ?? '')}
          maxLength={TEXT_INPUT_MAX}
        />

        <MultiSelect
          labelText={`${t('string-attribute-languages')} (sh:languageIn)`}
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
          selectedItems={
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
      </RestrictionWrapper>
      <Separator />
    </>
  );
}
