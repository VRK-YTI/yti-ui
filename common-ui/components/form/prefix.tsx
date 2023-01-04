import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import {
  Label,
  Paragraph,
  RadioButton,
  RadioButtonGroup,
  Text,
} from 'suomifi-ui-components';
import { v4 } from 'uuid';
import { TEXT_INPUT_MAX } from '../../utils/constants';
import { PrefixContainer, TextInput } from './prefix.styles';

interface PrefixProps {
  validatePrefixMutation: any;
  typeInUri: string;
}

export default function Prefix({
  validatePrefixMutation,
  typeInUri,
}: PrefixProps) {
  const URI = 'http://uri.suomi.fi';
  const { t } = useTranslation('admin');
  const [randomURL] = useState(v4().substring(0, 8));
  const [inputType, setInputType] = useState('automatic');
  const [prefix, setPrefix] = useState(randomURL);
  const [prefixValid, setPrefixValid] = useState(true);
  const [validatePrefix, validPrefix] = validatePrefixMutation();

  const handleInputTypeChange = (e: string) => {
    setInputType(e);

    if (e === 'automatic') {
      setPrefix(randomURL);
      setPrefixValid(true);
      return;
    }

    setPrefix('');
  };

  const handleTextInput = (e: string) => {
    setPrefix(e);
    const inputOnlyValid = e.match(/[a-z0-9\-_]*/g)?.join('');

    if (inputOnlyValid?.length === e.length && e.length > 0) {
      setPrefixValid(true);
      validatePrefix(inputOnlyValid);
      return;
    }

    setPrefixValid(false);
  };

  useEffect(() => {
    if (validPrefix.isError) {
      setPrefixValid(false);
    }

    if (validPrefix.isSuccess) {
      setPrefixValid(validPrefix.data);
    }
  }, [validPrefix]);

  return (
    <PrefixContainer>
      <RadioButtonGroup
        labelText={'Tunnus'}
        groupHintText={
          'Tietomallin yksilöivä tunnus, jota ei voi muuttaa sanaston luonnin jälkeen.'
        }
        defaultValue="automatic"
        name="prefix"
        onChange={(e) => handleInputTypeChange(e)}
      >
        <RadioButton value="automatic" id="prefix-input-automatic">
          Luo tunnus automaattisesti
        </RadioButton>
        <RadioButton value="manual" id="prefix-input-manual">
          Kirjoita oma tunnus
        </RadioButton>
      </RadioButtonGroup>

      {inputType === 'manual' && (
        <div>
          <TextInput
            labelText="Tunnus"
            visualPlaceholder="Kirjoita tunnus"
            onChange={(e) => handleTextInput(e?.toString().trim() ?? '')}
            debounce={500}
            maxLength={TEXT_INPUT_MAX}
            id="prefix-text-input"
            status={prefixValid ? 'default' : 'error'}
            defaultValue={prefix}
          />
        </div>
      )}

      <div>
        <Label>URI:n esikatselu</Label>
        <Paragraph>
          <Text smallScreen>
            {URI}/{typeInUri}/{prefix}
            {prefix && '/'}
          </Text>
        </Paragraph>
      </div>
    </PrefixContainer>
  );
}
