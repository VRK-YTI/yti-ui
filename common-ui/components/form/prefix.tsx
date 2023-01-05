import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import {
  Label,
  Paragraph,
  RadioButton,
  RadioButtonGroup,
  Text,
} from 'suomifi-ui-components';
import { TEXT_INPUT_MAX } from '../../utils/constants';
import { PrefixContainer, TextInput } from './prefix.styles';

interface PrefixProps {
  prefix: string;
  setPrefix: (value: string) => void;
  validatePrefixMutation: any;
  typeInUri: string;
  initialData: string;
  error: boolean;
  disabled?: boolean;
}

export default function Prefix({
  prefix,
  setPrefix,
  validatePrefixMutation,
  typeInUri,
  initialData,
  error,
  disabled,
}: PrefixProps) {
  const URI = 'http://uri.suomi.fi';
  const { t } = useTranslation('admin');
  const [initalPrefix] = useState(prefix);
  const [inputType, setInputType] = useState('automatic');
  const [prefixValid, setPrefixValid] = useState(true);
  const [validatePrefix, validPrefix] = validatePrefixMutation();

  const handleInputTypeChange = (e: string) => {
    setInputType(e);

    if (e === 'automatic') {
      setPrefix(initalPrefix);
      setPrefixValid(true);
      return;
    }

    setPrefix('');
    setPrefixValid(false);
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
        <RadioButton
          value="automatic"
          id="prefix-input-automatic"
          disabled={disabled}
        >
          Luo tunnus automaattisesti
        </RadioButton>
        <RadioButton
          value="manual"
          id="prefix-input-manual"
          disabled={disabled}
        >
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
            status={
              (prefix !== '' && (!prefixValid || validPrefix.data === false)) ||
              error
                ? 'error'
                : 'default'
            }
            statusText={
              (prefix !== '' &&
                ((!prefixValid && 'invalid form') ||
                  (validPrefix.data === false && 'taken'))) ||
              ''
            }
            defaultValue={prefix}
            disabled={disabled}
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
