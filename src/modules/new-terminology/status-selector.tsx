import { BlankFieldset } from '@app/common/components/terminology-components/terminology-components.styles';
import { useTranslation } from 'next-i18next';
import { SingleSelectData } from 'suomifi-ui-components';
import { StatusSingleSelect } from './new-terminology.styles';
import { UpdateTerminology } from './update-terminology.interface';

export interface StatusSelectorProps {
  update: ({ key, data }: UpdateTerminology) => void;
  defaultValue?: string;
}

export default function StatusSelector({
  update,
  defaultValue,
}: StatusSelectorProps) {
  const { t } = useTranslation('admin');

  const statuses = [
    {
      name: 'VALID',
      uniqueItemId: 'VALID',
      labelText: t('statuses.valid', { ns: 'common' }),
    },
    {
      name: 'INCOMPLETE',
      uniqueItemId: 'INCOMPLETE',
      labelText: t('statuses.incomplete', { ns: 'common' }),
    },
    {
      name: 'DRAFT',
      uniqueItemId: 'DRAFT',
      labelText: t('statuses.draft', { ns: 'common' }),
    },
    {
      name: 'RETIRED',
      uniqueItemId: 'RETIRED',
      labelText: t('statuses.retired', { ns: 'common' }),
    },
    {
      name: 'SUPERSEDED',
      uniqueItemId: 'SUPERSEDED',
      labelText: t('statuses.superseded', { ns: 'common' }),
    },
    {
      name: 'INVALID',
      uniqueItemId: 'INVALID',
      labelText: t('statuses.invalid', { ns: 'common' }),
    },
  ];

  const handleChange = (e: SingleSelectData | null) => {
    update({ key: 'status', data: e });
  };

  return (
    <BlankFieldset>
      <StatusSingleSelect
        ariaOptionsAvailableText={t('statuses-available')}
        clearButtonLabel={t('clear-button-label')}
        items={statuses}
        labelText={t('terminology-status')}
        noItemsText={t('no-statuses-available')}
        hintText={t('statuses-hint-text')}
        defaultSelectedItem={
          statuses.find((status) => status.uniqueItemId === defaultValue) ??
          undefined
        }
        onItemSelectionChange={(e) => handleChange(e)}
      />
    </BlankFieldset>
  );
}
