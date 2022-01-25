import { useState } from 'react';
import { RadioButton } from 'suomifi-ui-components';
import { RadioButtonGroupSmBot } from './new-terminology.styles';

export default function TypeSelector() {
  const [selectedType, setSelectedType] = useState('terminology');

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
