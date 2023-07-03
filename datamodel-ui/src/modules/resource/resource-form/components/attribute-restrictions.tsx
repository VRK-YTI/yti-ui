import InlineListBlock from '@app/common/components/inline-list-block';
import { ResourceFormType } from '@app/common/interfaces/resource-form.interface';
import { ResourceType } from '@app/common/interfaces/resource-type.interface';
import { useTranslation } from 'next-i18next';
import {
  Button,
  IconPlus,
  MultiSelect,
  SingleSelect,
  Text,
  TextInput,
} from 'suomifi-ui-components';
import Separator from 'yti-common-ui/separator';

export default function AttributeRestrictions({
  data,
  type,
  applicationProfile,
  handleUpdate,
}: {
  data: ResourceFormType;
  type: ResourceType;
  applicationProfile?: boolean;
  handleUpdate: (
    key: keyof ResourceFormType,
    value: ResourceFormType[typeof key]
  ) => void;
}) {
  const { t } = useTranslation('admin');

  if (type !== ResourceType.ATTRIBUTE || !applicationProfile) {
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
          <Button variant="secondary" icon={<IconPlus />}>
            {t('add-reference-data')}
          </Button>
        }
        handleRemoval={() => null}
        items={[]}
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
      />

      <TextInput
        labelText={t('maximum-length')}
        optionalText={t('optional')}
        visualPlaceholder={t('input-value')}
        defaultValue={data.maxLength}
        onChange={(e) => handleUpdate('maxLength', e?.toString() ?? '')}
      />

      <TextInput
        labelText={t('minimum-amount')}
        optionalText={t('optional')}
        visualPlaceholder={t('input-value')}
        defaultValue={data.minCount}
        onChange={(e) => handleUpdate('minCount', e?.toString() ?? '')}
      />

      <TextInput
        labelText={t('maximum-amount')}
        optionalText={t('optional')}
        visualPlaceholder={t('input-value')}
        defaultValue={data.maxCount}
        onChange={(e) => handleUpdate('maxCount', e?.toString() ?? '')}
      />

      <TextInput
        labelText={t('larger-or-as-large-as')}
        optionalText={t('optional')}
        visualPlaceholder={t('input-value')}
      />

      <TextInput
        labelText={t('smaller-or-as-small-as')}
        optionalText={t('optional')}
        visualPlaceholder={t('input-value')}
      />

      <TextInput
        labelText={t('larger-than')}
        optionalText={t('optional')}
        visualPlaceholder={t('input-value')}
      />

      <TextInput
        labelText={t('smaller-than')}
        optionalText={t('optional')}
        visualPlaceholder={t('input-value')}
      />

      <TextInput
        labelText={t('string-attribute-format')}
        optionalText={t('optional')}
        visualPlaceholder={t('input-value')}
      />

      <SingleSelect
        labelText={t('string-attribute-languages')}
        clearButtonLabel=""
        itemAdditionHelpText=""
        ariaOptionsAvailableText=""
        items={[]}
        optionalText={t('optional')}
        visualPlaceholder={t('select-languages')}
      />

      <Separator />
    </>
  );
}
