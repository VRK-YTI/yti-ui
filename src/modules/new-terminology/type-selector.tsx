import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { RadioButton } from 'suomifi-ui-components';
import { BlankFieldset, RadioButtonGroupSmBot } from './new-terminology.styles';
import { UpdateTerminology } from './update-terminology.interface';

export interface TypeSelectorProps {
  update: ({ key, data }: UpdateTerminology) => void;
}

export default function TypeSelector({ update }: TypeSelectorProps) {
  const { t } = useTranslation('admin');
  const [, setSelectedType] = useState('terminology');

  const handleSetSelected = (value: string) => {
    setSelectedType(value);
    update({ key: 'type', data: value });
  };

  return (
    <BlankFieldset>
      <RadioButtonGroupSmBot
        labelText={t('terminology-type')}
        name="terminology-type"
        defaultValue="terminology"
        onChange={(e) => handleSetSelected(e)}
      >
        <RadioButton value="terminology">
          {t('terminological-vocabulary')}
        </RadioButton>
        <RadioButton value="other">{t('other-vocabulary')}</RadioButton>
      </RadioButtonGroupSmBot>
    </BlankFieldset>
  );
}
