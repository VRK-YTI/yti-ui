import { useEffect, useState } from 'react';
import { Paragraph, RadioButton, Text } from 'suomifi-ui-components';
import { useBreakpoints } from '../media-query/media-query-context';
import {
  RadioButtonGroupSmBot,
  TextInputSmBot,
} from './new-terminology.styles';

export default function Prefix({ update }: any) {
  const URI = 'http://uri.suomi.fi/';
  // TODO: Implement actual randomization
  // TODO: Add translation
  const randomURL = 'abcde56789';

  const { isSmall } = useBreakpoints();
  const [prefix, setPrefix] = useState(randomURL);
  const [prefixType, setPrefixType] = useState('');
  const [status, setStatus] = useState<'default' | 'error'>('default');

  useEffect(() => {
    update('prefix', [prefix, true]);
  }, []);

  const handlePrefixTypeChange = (value: string) => {
    setPrefixType(value);
    if (value !== 'manual') {
      setPrefix(randomURL);
      update('prefix', [randomURL, true]);
    } else {
      setPrefix('');
      update('prefix', ['', false]);
    }
  };

  const handleCustomChange = (e: string) => {
    setPrefix(e);
    const inputOnlyValid = e.match(/[a-z0-9\-\_]*/g)?.join('');

    if (inputOnlyValid?.length !== e.length) {
      setStatus('error');
      update('prefix', [e, false]);
      return;
    } else if (status !== 'default') {
      setStatus('default');
    }

    update('prefix', [e, e !== '']);
  };

  return (
    <>
      <RadioButtonGroupSmBot
        labelText="Tunnus"
        hintText="Sanaston yksilöivä tunnus, jota ei voi muuttaa sanaston luonnin jälkeen."
        name="prefix"
        defaultValue="automatic"
        onChange={(e) => {
          handlePrefixTypeChange(e);
        }}
      >
        <RadioButton value="automatic">Luo tunnus automaattisesti</RadioButton>
        <RadioButton value="manual">Valitse oma tunnus</RadioButton>
      </RadioButtonGroupSmBot>
      {prefixType === 'manual' && (
        <TextInputSmBot
          labelText="Tunnus"
          onChange={(e) => handleCustomChange(e as string)}
          isSmall={isSmall}
          status={status}
          statusText={
            status === 'error'
              ? 'Etuliitteen sallitut merkit ovat a-z, 0-9, alaviiva ja väliviiva'
              : ''
          }
        />
      )}
      <Paragraph>
        <Text variant="bold" smallScreen>
          Url:n esikatselu
        </Text>
      </Paragraph>
      <Paragraph>
        <Text smallScreen>
          {URI}
          {prefix}
          {prefix && '/'}
        </Text>
      </Paragraph>
    </>
  );
}
