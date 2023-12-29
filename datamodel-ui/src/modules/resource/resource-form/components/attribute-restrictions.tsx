import {
  useGetAllCodesQuery,
  useGetLanguagesQuery,
} from '@app/common/components/code/code.slice';
import InlineListBlock from '@app/common/components/inline-list-block';
import { ResourceFormType } from '@app/common/interfaces/resource-form.interface';
import { ResourceType } from '@app/common/interfaces/resource-type.interface';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import CodeListModal from '@app/modules/code-list-modal';
import { compareLocales } from '@app/common/utils/compare-locals';
import { useTranslation } from 'next-i18next';
import {
  Button,
  IconClose,
  MultiSelect,
  MultiSelectData,
  SingleSelect,
  Text,
  TextInput,
  Tooltip,
} from 'suomifi-ui-components';
import Separator from 'yti-common-ui/separator';
import { CommonFormErrors } from '../validate-form';
import { useEffect, useState } from 'react';
import { TEXT_INPUT_MAX } from 'yti-common-ui/utils/constants';
import styled from 'styled-components';
import { BasicBlock } from 'yti-common-ui/block';
import { v4 } from 'uuid';
import { ModelCodeList } from '@app/common/interfaces/model.interface';
import { ConfirmationModal } from './confirmation-modal';
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
  handleUpdateData,
}: {
  data: ResourceFormType;
  errors: CommonFormErrors;
  applicationProfile?: boolean;
  handleUpdate: (
    key: keyof ResourceFormType,
    value: ResourceFormType[typeof key]
  ) => void;
  handleUpdateData: (value: ResourceFormType) => void;
}) {
  const { t, i18n } = useTranslation('admin');
  const { data: languages } = useGetLanguagesQuery();
  const { data: codesResult, isSuccess } = useGetAllCodesQuery(
    data.codeLists?.map((codelist) => codelist.id) ?? [],
    {
      skip:
        !applicationProfile || !data.codeLists || data.codeLists.length === 0,
    }
  );
  const [codes, setCodes] = useState<MultiSelectData[]>([]);
  const [codelistToRemove, setCodelistToRemove] = useState('');

  useEffect(() => {
    if (isSuccess) {
      setCodes(
        codesResult.map((code) => {
          return {
            labelText: getLanguageVersion({
              data: code.prefLabel,
              lang: i18n.language,
              appendLocale: true,
            }),
            uniqueItemId: code.uri,
          };
        })
      );
    }
  }, [codesResult, i18n.language, isSuccess]);

  const handleCodeListUpdate = (value: ModelCodeList[]) => {
    const mappedValues = value.map((v) => ({
      id: v.id,
      prefLabel: v.prefLabel,
      status: v.status,
    }));

    if (!data.codeLists || data.codeLists.length === 0) {
      handleUpdateData({
        ...data,
        allowedValues: [],
        defaultValue: '',
        hasValue: '',
        codeLists: mappedValues,
      });
    } else {
      handleUpdate('codeLists', mappedValues);
    }
  };

  const handleRemoveCodelist = (id: string) => {
    const hasValue = data.hasValue?.startsWith(id) ? '' : data.hasValue;
    const defaultValue = data.defaultValue?.startsWith(id)
      ? ''
      : data.defaultValue;
    const allowedValues =
      data.allowedValues?.filter((value) => !value.id.startsWith(id)) ?? [];
    const codelists = data.codeLists?.filter((cl) => cl.id !== id) ?? [];
    handleUpdateData({
      ...data,
      hasValue: hasValue,
      defaultValue: defaultValue,
      allowedValues: allowedValues,
      codeLists: codelists,
    });
    setCodelistToRemove('');
  };

  if (data.type !== ResourceType.ATTRIBUTE || !applicationProfile) {
    return <></>;
  }

  return (
    <>
      <Separator />

      <div style={{ marginBottom: '10px' }}>
        <Text variant="bold">{t('restrictions', { ns: 'common' })}</Text>
      </div>

      <RestrictionWrapper>
        <InlineListBlock
          addNewComponent={
            <CodeListModal
              showConfirmModal={
                (!data.codeLists || data.codeLists.length === 0) &&
                ((data.allowedValues && data.allowedValues.length > 0) ||
                  data.defaultValue ||
                  data.hasValue)
                  ? true
                  : false
              }
              extendedView
              modalTitle={t('add-reference-data')}
              initialData={data.codeLists ?? []}
              setData={(value) => handleCodeListUpdate(value)}
            />
          }
          handleRemoval={(id) => {
            setCodelistToRemove(id);
          }}
          items={
            data.codeLists?.map((cl) => ({
              uri: cl.id,
              label: cl.prefLabel,
            })) ?? []
          }
          label={t('codelist')}
        />

        <ConfirmationModal
          label={
            data.codeLists?.find((cl) => cl.id === codelistToRemove)?.prefLabel
          }
          visible={codelistToRemove ? true : false}
          handleClick={(confirmed) =>
            confirmed
              ? handleRemoveCodelist(codelistToRemove)
              : setCodelistToRemove('')
          }
        />

        {data.codeLists && data.codeLists.length > 0 && codes.length !== 0 ? (
          <>
            <MultiSelect
              labelText={`${t('allowed-values')} (sh:in)`}
              tooltipComponent={
                <Tooltip
                  ariaCloseButtonLabelText=""
                  ariaToggleButtonLabelText=""
                >
                  {t('tooltip.allowed-values', { ns: 'common' })}
                </Tooltip>
              }
              ariaOptionsAvailableText=""
              ariaOptionChipRemovedTextFunction={() => ''}
              ariaSelectedAmountTextFunction={() => ''}
              optionalText={t('optional')}
              visualPlaceholder={t('select-values')}
              items={codes}
              selectedItems={
                data.allowedValues
                  ? codes.filter((code) =>
                      data.allowedValues?.some(
                        (val) => val.label === code.uniqueItemId
                      )
                    )
                  : []
              }
              allowItemAddition
              itemAdditionHelpText=""
              chipListVisible
              onItemSelectionsChange={(e) => {
                return handleUpdate(
                  'allowedValues',
                  e.map((val) => {
                    return { label: val.uniqueItemId, id: val.uniqueItemId };
                  }) ?? []
                );
              }}
            />

            <SingleSelect
              labelText={`${t('default-value')} (sh:defaultValue)`}
              tooltipComponent={
                <Tooltip
                  ariaCloseButtonLabelText=""
                  ariaToggleButtonLabelText=""
                >
                  {t('tooltip.default-value', { ns: 'common' })}
                </Tooltip>
              }
              clearButtonLabel=""
              ariaOptionsAvailableText=""
              items={codes}
              selectedItem={
                data.defaultValue
                  ? codes.find(
                      (code) => code.uniqueItemId === data.defaultValue
                    )
                  : undefined
              }
              optionalText={t('optional')}
              visualPlaceholder={t('select-value')}
              allowItemAddition
              itemAdditionHelpText=""
              onItemSelect={(e) => handleUpdate('defaultValue', e ?? '')}
            />

            <SingleSelect
              labelText={`${t('required-value')} (sh:hasValue)`}
              tooltipComponent={
                <Tooltip
                  ariaCloseButtonLabelText=""
                  ariaToggleButtonLabelText=""
                >
                  {t('tooltip.required-value', { ns: 'common' })}
                </Tooltip>
              }
              clearButtonLabel=""
              ariaOptionsAvailableText=""
              items={codes}
              selectedItem={
                data.defaultValue
                  ? codes.find((code) => code.uniqueItemId === data.hasValue)
                  : undefined
              }
              optionalText={t('optional')}
              visualPlaceholder={t('select-value')}
              allowItemAddition
              itemAdditionHelpText=""
              onItemSelect={(e) => handleUpdate('hasValue', e ?? '')}
            />
          </>
        ) : (
          <>
            <BasicBlock
              title={`${t('allowed-values')} (sh:in)`}
              tooltip={{
                text: t('tooltip.allowed-values', { ns: 'common' }),
                ariaCloseButtonLabelText: '',
                ariaToggleButtonLabelText: '',
              }}
            >
              {data.allowedValues && (
                <>
                  {data.allowedValues.map((value) => {
                    return (
                      <TextInput
                        key={`allowed-value-${value.id}`}
                        labelMode="hidden"
                        labelText=""
                        defaultValue={value.label}
                        onChange={(e) => {
                          const newVals =
                            data.allowedValues?.map((val) =>
                              val.id === value.id
                                ? { label: (e as string) ?? '', id: val.id }
                                : val
                            ) ?? [];
                          return handleUpdate('allowedValues', newVals);
                        }}
                        icon={
                          <IconClose
                            fill={'hsl(212, 63%, 45%)'}
                            onClick={() => {
                              return handleUpdate(
                                'allowedValues',
                                data.allowedValues?.filter(
                                  (id) => id !== value
                                ) || []
                              );
                            }}
                          />
                        }
                      />
                    );
                  })}
                </>
              )}
              <div>
                <Button
                  variant="secondary"
                  onClick={() =>
                    handleUpdate('allowedValues', [
                      ...(data.allowedValues ?? []),
                      { label: '', id: v4().split('-')[0] },
                    ])
                  }
                  disabled={
                    data.allowedValues &&
                    data.allowedValues.some((val) => val.label === '')
                  }
                >
                  {t('add-value')}
                </Button>
              </div>
            </BasicBlock>
            <TextInput
              labelText={`${t('default-value')} (sh:defaultValue)`}
              tooltipComponent={
                <Tooltip
                  ariaCloseButtonLabelText=""
                  ariaToggleButtonLabelText=""
                >
                  {t('tooltip.default-value', { ns: 'common' })}
                </Tooltip>
              }
              optionalText={t('optional')}
              visualPlaceholder={t('input-value')}
              defaultValue={data.defaultValue}
              onChange={(e) => handleUpdate('defaultValue', e ?? '')}
              maxLength={TEXT_INPUT_MAX}
            />
            <TextInput
              labelText={`${t('required-value')} (sh:hasValue)`}
              tooltipComponent={
                <Tooltip
                  ariaCloseButtonLabelText=""
                  ariaToggleButtonLabelText=""
                >
                  {t('tooltip.required-value', { ns: 'common' })}
                </Tooltip>
              }
              optionalText={t('optional')}
              visualPlaceholder={t('input-value')}
              defaultValue={data.hasValue}
              onChange={(e) => handleUpdate('hasValue', e ?? '')}
              maxLength={TEXT_INPUT_MAX}
            />
          </>
        )}

        <TextInput
          labelText={`${t('minimum-length')} (sh:minLength)`}
          optionalText={t('optional')}
          tooltipComponent={
            <Tooltip ariaCloseButtonLabelText="" ariaToggleButtonLabelText="">
              {t('tooltip.minimum-length', { ns: 'common' })}
            </Tooltip>
          }
          visualPlaceholder={t('input-value')}
          defaultValue={data.minLength}
          onChange={(e) => handleUpdate('minLength', e?.toString() ?? '')}
          status={errors['minLength'] ? 'error' : 'default'}
          maxLength={TEXT_INPUT_MAX}
        />

        <TextInput
          labelText={`${t('maximum-length')} (sh:maxLength)`}
          optionalText={t('optional')}
          tooltipComponent={
            <Tooltip ariaCloseButtonLabelText="" ariaToggleButtonLabelText="">
              {t('tooltip.maximum-length', { ns: 'common' })}
            </Tooltip>
          }
          visualPlaceholder={t('input-value')}
          defaultValue={data.maxLength}
          onChange={(e) => handleUpdate('maxLength', e?.toString() ?? '')}
          status={errors['maxLength'] ? 'error' : 'default'}
          maxLength={TEXT_INPUT_MAX}
        />

        <TextInput
          labelText={`${t('minimum-count', { ns: 'common' })} (sh:minCount)`}
          optionalText={t('optional')}
          tooltipComponent={
            <Tooltip ariaCloseButtonLabelText="" ariaToggleButtonLabelText="">
              {t('tooltip.minimum-amount', { ns: 'common' })}
            </Tooltip>
          }
          visualPlaceholder={t('input-value')}
          defaultValue={data.minCount}
          onChange={(e) => handleUpdate('minCount', e?.toString() ?? '')}
          status={errors['minCount'] ? 'error' : 'default'}
          maxLength={TEXT_INPUT_MAX}
        />

        <TextInput
          labelText={`${t('maximum-count', { ns: 'common' })} (sh:maxCount)`}
          optionalText={t('optional')}
          tooltipComponent={
            <Tooltip ariaCloseButtonLabelText="" ariaToggleButtonLabelText="">
              {t('tooltip.maximum-amount', { ns: 'common' })}
            </Tooltip>
          }
          visualPlaceholder={t('input-value')}
          defaultValue={data.maxCount}
          onChange={(e) => handleUpdate('maxCount', e?.toString() ?? '')}
          status={errors['maxCount'] ? 'error' : 'default'}
          maxLength={TEXT_INPUT_MAX}
        />

        <TextInput
          labelText={`${t('larger-or-as-large-as')} (sh:minInclusive)`}
          optionalText={t('optional')}
          tooltipComponent={
            <Tooltip ariaCloseButtonLabelText="" ariaToggleButtonLabelText="">
              {t('tooltip.larger-or-as-large-as', { ns: 'common' })}
            </Tooltip>
          }
          visualPlaceholder={t('input-value')}
          defaultValue={data.minInclusive}
          onChange={(e) => handleUpdate('minInclusive', e?.toString() ?? '')}
          status={errors['minInclusive'] ? 'error' : 'default'}
          maxLength={TEXT_INPUT_MAX}
        />

        <TextInput
          labelText={`${t('smaller-or-as-small-as')} (sh:maxInclusive)`}
          optionalText={t('optional')}
          tooltipComponent={
            <Tooltip ariaCloseButtonLabelText="" ariaToggleButtonLabelText="">
              {t('tooltip.smaller-or-as-small-as', { ns: 'common' })}
            </Tooltip>
          }
          visualPlaceholder={t('input-value')}
          defaultValue={data.maxInclusive}
          onChange={(e) => handleUpdate('maxInclusive', e?.toString() ?? '')}
          status={errors['maxInclusive'] ? 'error' : 'default'}
          maxLength={TEXT_INPUT_MAX}
        />

        <TextInput
          labelText={`${t('larger-than')} (sh:minExclusive)`}
          optionalText={t('optional')}
          tooltipComponent={
            <Tooltip ariaCloseButtonLabelText="" ariaToggleButtonLabelText="">
              {t('tooltip.larger-than', { ns: 'common' })}
            </Tooltip>
          }
          visualPlaceholder={t('input-value')}
          defaultValue={data.minExclusive}
          onChange={(e) => handleUpdate('minExclusive', e?.toString() ?? '')}
          status={errors['minExclusive'] ? 'error' : 'default'}
          maxLength={TEXT_INPUT_MAX}
        />

        <TextInput
          labelText={`${t('smaller-than')} (sh:maxExclusive)`}
          optionalText={t('optional')}
          tooltipComponent={
            <Tooltip ariaCloseButtonLabelText="" ariaToggleButtonLabelText="">
              {t('tooltip.smaller-than', { ns: 'common' })}
            </Tooltip>
          }
          visualPlaceholder={t('input-value')}
          defaultValue={data.maxExclusive}
          onChange={(e) => handleUpdate('maxExclusive', e?.toString() ?? '')}
          status={errors['maxExclusive'] ? 'error' : 'default'}
          maxLength={TEXT_INPUT_MAX}
        />

        <TextInput
          labelText={`${t('string-attribute-format')} (sh:pattern)`}
          optionalText={t('optional')}
          tooltipComponent={
            <Tooltip ariaCloseButtonLabelText="" ariaToggleButtonLabelText="">
              {t('tooltip.string-attribute-format', { ns: 'common' })}
            </Tooltip>
          }
          visualPlaceholder={t('input-value')}
          defaultValue={data.pattern}
          onChange={(e) => handleUpdate('pattern', e?.toString() ?? '')}
          maxLength={TEXT_INPUT_MAX}
        />

        <MultiSelect
          labelText={`${t('string-attribute-languages')} (sh:languageIn)`}
          visualPlaceholder={t('select-languages')}
          optionalText={t('optional')}
          tooltipComponent={
            <Tooltip ariaCloseButtonLabelText="" ariaToggleButtonLabelText="">
              {t('tooltip.string-attribute-languages', { ns: 'common' })}
            </Tooltip>
          }
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
