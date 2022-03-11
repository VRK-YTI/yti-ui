import { useEffect, useState } from 'react';
import { RadioButton } from 'suomifi-ui-components';
import { RadioButtonGroupSmBot } from './new-terminology.styles';

export default function TypeSelector({ update }: any) {
  const [selectedType, setSelectedType] = useState('terminology');

  useEffect(() => {
    update('type', selectedType);
  }, [selectedType]);

  return (
    <RadioButtonGroupSmBot
      labelText='Sanastotyyppi'
      name='terminology-type'
      defaultValue='terminology'
      onChange={(e) => setSelectedType(e)}
    >
      <RadioButton value='terminology'>
        Terminologinen sanasto
      </RadioButton>
      <RadioButton value='other'>
        Muu sanasto
      </RadioButton>
    </RadioButtonGroupSmBot>
  );
}
