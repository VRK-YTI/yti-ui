import { useBreakpoints } from 'yti-common-ui/media-query';
import { BlankFieldset } from '@app/common/components/terminology-components/terminology-components.styles';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { SingleSelectData } from 'suomifi-ui-components';
import { StatusSingleSelect } from './new-terminology.styles';
import { UpdateTerminology } from './update-terminology.interface';

export interface StatusSelectorProps {
  update: ({ key, data }: UpdateTerminology) => void;
  userPosted: boolean;
  defaultValue?: string;
  disabled?: boolean;
}

export default function StatusSelector({
  update,
  userPosted,
  defaultValue,
  disabled,
}: StatusSelectorProps) {
  const { t } = useTranslation('admin');
  const { isSmall } = useBreakpoints();
  const [isError, setIsError] = useState(defaultValue ? false : true);

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
    update({ key: 'status', data: e?.uniqueItemId });
    setIsError(e !== null ? false : true);
  };

  return (
    <BlankFieldset>
      <StatusSingleSelect
        ariaOptionsAvailableText={t('statuses-available') as string}
        clearButtonLabel={t('clear-button-label')}
        items={statuses}
        labelText={t('terminology-status')}
        hintText={t('statuses-hint-text')}
        itemAdditionHelpText=""
        defaultSelectedItem={
          statuses.find((status) => status.uniqueItemId === defaultValue) ??
          undefined
        }
        status={userPosted && isError ? 'error' : 'default'}
        onItemSelectionChange={(e) => handleChange(e)}
        $isSmall={isSmall}
        disabled={disabled}
      />
    </BlankFieldset>
  );
}
