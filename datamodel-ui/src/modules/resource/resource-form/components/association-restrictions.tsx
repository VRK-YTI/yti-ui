import InlineListBlock from '@app/common/components/inline-list-block';
import { ResourceFormType } from '@app/common/interfaces/resource-form.interface';
import { ResourceType } from '@app/common/interfaces/resource-type.interface';
import { useTranslation } from 'next-i18next';
import { Button, TextInput } from 'suomifi-ui-components';

export default function AssociationRestrictions({
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

  if (type !== ResourceType.ASSOCIATION) {
    return <></>;
  }

  if (applicationProfile) {
    return (
      <>
        <InlineListBlock
          addNewComponent={
            <Button variant="secondary">{t('select-association')}</Button>
          }
          handleRemoval={() => handleUpdate('path', undefined)}
          items={data.path ? [data.path] : []}
          label={t('target-association')}
        />

        <InlineListBlock
          addNewComponent={
            <Button variant="secondary">{t('select-class')}</Button>
          }
          handleRemoval={() => null}
          items={[]}
          label={t('association-targets-class', { ns: 'common' })}
        />

        <TextInput
          labelText={t('minimum-amount')}
          optionalText={t('optional')}
          defaultValue={data.minCount?.toString() ?? ''}
          onChange={(e) => handleUpdate('minCount', e?.toString() ?? '')}
        />

        <TextInput
          labelText={t('maximum-amount')}
          optionalText={t('optional')}
          defaultValue={data.maxCount?.toString() ?? ''}
          onChange={(e) => handleUpdate('maxCount', e?.toString() ?? '')}
        />
      </>
    );
  }

  return <></>;
}
