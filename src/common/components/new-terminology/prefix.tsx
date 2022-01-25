import { useState } from 'react';
import { Paragraph, RadioButton, Text } from 'suomifi-ui-components';
import { useBreakpoints } from '../media-query/media-query-context';
import { RadioButtonGroupSmBot, TextInputSmBot } from './new-terminology.styles';

export default function Prefix() {
  const URI = 'http://uri.suomi.fi/';
  // TODO: Implement actual randomization
  const randomURL = 'abcde56789';

  const { isSmall } = useBreakpoints();
  const [prefix, setPrefix] = useState(randomURL);
  const [prefixType, setPrefixType] = useState('');



  const handlePrefixTypeChange = (value: string) => {
    setPrefixType(value);
    if (value !== 'manual') {
      setPrefix(randomURL);
    } else {
      setPrefix('');
    }
  };

  return (
    <>
      <RadioButtonGroupSmBot
        labelText='Tunnus'
        hintText='Sanaston yksilöivä tunnus, jota ei voi muuttaa sanaston luonnin jälkeen.'
        name='prefix'
        defaultValue='automatic'
        onChange={(e) => {
          handlePrefixTypeChange(e);
        }}
      >
        <RadioButton value='automatic'>
          Luo tunnus automaattisesti
        </RadioButton>
        <RadioButton value='manual'>
          Valitse oma tunnus
        </RadioButton>
      </RadioButtonGroupSmBot>
      {prefixType === 'manual' &&
        <TextInputSmBot
          labelText='Tunnus'
          onChange={e => setPrefix(e as string)}
          isSmall={isSmall}
        />
      }
      <Paragraph>
        <Text variant='bold' smallScreen>
          Url:n esikatselu
        </Text>
      </Paragraph>
      <Paragraph>
        <Text smallScreen>
          {URI}{prefix}
        </Text>
      </Paragraph>
    </>
  );
}
