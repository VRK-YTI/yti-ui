import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { SingleSelect } from 'suomifi-ui-components';
import { FormError } from '../validate-form';
import { BasicInfoUpdate } from './concept-basic-information-types';

interface StatusPickerProps {
  initialValue: string;
  update: ({ key, lang, value }: BasicInfoUpdate) => void;
  errors: FormError;
}

export default function StatusPicker({
  initialValue,
  update,
  errors,
}: StatusPickerProps) {
  const { t } = useTranslation('admin');
  const [status, setStatus] = useState(initialValue);

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

  const handleChange = (e: string) => {
    update({ key: 'status', value: e });
    setStatus(e);
  };

  return (
    <div style={{ marginTop: '20px', marginBottom: '5px' }}>
      <SingleSelect
        ariaOptionsAvailableText={t('statuses-available') as string}
        clearButtonLabel={t('clear-button-label')}
        items={statuses}
        labelText={t('concept-status')}
        itemAdditionHelpText=""
        defaultSelectedItem={statuses.find(
          (s) => s.uniqueItemId === initialValue
        )}
        onItemSelect={(e) => handleChange(e ?? '')}
        status={!status && errors.status ? 'error' : 'default'}
      />
    </div>
  );
}
