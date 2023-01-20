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
import { UseMutation } from '@reduxjs/toolkit/dist/query/react/buildHooks';

interface PrefixProps {
  prefix: string;
  setPrefix: (value: string) => void;
  // Using 'any' here same way useMutation() is implemented
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validatePrefixMutation: UseMutation<any>;
  typeInUri: string;
  error: boolean;
  translations: {
    label: string;
    hintText: string;
    automatic: string;
    manual: string;
    textInputLabel: string;
    textInputHint: string;
    errorInvalid: string;
    errorTaken: string;
    uriPreview: string;
  };
  invertCheck?: boolean;
  disabled?: boolean;
}

export default function Prefix({
  prefix,
  setPrefix,
  validatePrefixMutation,
  typeInUri,
  error,
  translations,
  invertCheck,
  disabled,
}: PrefixProps) {
  const URI = 'http://uri.suomi.fi';
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
        labelText={translations.label}
        groupHintText={translations.hintText}
        defaultValue="automatic"
        name="prefix"
        onChange={(e) => handleInputTypeChange(e)}
      >
        <RadioButton
          value="automatic"
          id="prefix-input-automatic"
          disabled={disabled}
        >
          {translations.automatic}
        </RadioButton>
        <RadioButton
          value="manual"
          id="prefix-input-manual"
          disabled={disabled}
        >
          {translations.manual}
        </RadioButton>
      </RadioButtonGroup>

      {inputType === 'manual' && (
        <div>
          <TextInput
            labelText={translations.textInputLabel}
            visualPlaceholder={translations.textInputHint}
            onChange={(e) => handleTextInput(e?.toString().trim() ?? '')}
            debounce={500}
            maxLength={TEXT_INPUT_MAX}
            id="prefix-text-input"
            status={
              (prefix !== '' &&
                (!prefixValid ||
                  validPrefix.data === (invertCheck ? true : false))) ||
              error
                ? 'error'
                : 'default'
            }
            statusText={
              (prefix !== '' &&
                ((!prefixValid && translations.errorInvalid) ||
                  (validPrefix.data === (invertCheck ? true : false) &&
                    translations.errorTaken))) ||
              ''
            }
            defaultValue={prefix}
            disabled={disabled}
          />
        </div>
      )}

      <div>
        <Label>{translations.uriPreview}</Label>
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
