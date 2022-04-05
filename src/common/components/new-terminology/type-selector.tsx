import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { RadioButton } from 'suomifi-ui-components';
import { BlankFieldset, RadioButtonGroupSmBot } from './new-terminology.styles';

export default function TypeSelector({ update }: any) {
  const { t } = useTranslation('admin');
  const [selectedType, setSelectedType] = useState('terminology');

  useEffect(() => {
    update('type', selectedType);
  }, [selectedType]);

  return (
    <BlankFieldset>
      <RadioButtonGroupSmBot
        labelText={t('terminology-type')}
        name="terminology-type"
        defaultValue="terminology"
        onChange={(e) => setSelectedType(e)}
      >
        <RadioButton value="terminology">{t('terminological-vocabulary')}</RadioButton>
        <RadioButton value="other">{t('other-vocabulary')}</RadioButton>
      </RadioButtonGroupSmBot>
    </BlankFieldset>
  );
}
