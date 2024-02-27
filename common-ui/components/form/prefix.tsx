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
  inUseMutation: UseMutation<any>;
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
  disabled?: boolean;
  fullWidth?: boolean;
  noAuto?: boolean;
  maxLength?: number;
  minLength?: number;
}

export default function Prefix({
  prefix,
  setPrefix,
  inUseMutation,
  typeInUri,
  error,
  translations,
  disabled,
  fullWidth,
  noAuto,
  maxLength,
  minLength,
}: PrefixProps) {
  const URI =
    typeInUri === 'model' ? 'https://iri.suomi.fi' : 'http://uri.suomi.fi';
  const [initalPrefix] = useState(prefix);
  const [inputType, setInputType] = useState<'manual' | 'automatic'>(
    noAuto ? 'manual' : 'automatic'
  );
  const [prefixValid, setPrefixValid] = useState(true);
  const [validatePrefix, inUse] = inUseMutation();

  const handleInputTypeChange = (e: typeof inputType) => {
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
    <PrefixContainer id="prefix-container">
      {!noAuto && (
        <RadioButtonGroup
          labelText={translations.label}
          groupHintText={translations.hintText}
          defaultValue="automatic"
          name="prefix"
          onChange={(e) => handleInputTypeChange(e as typeof inputType)}
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
      )}

      {inputType === 'manual' && (
        <div>
          <TextInput
            labelText={translations.textInputLabel}
            hintText={noAuto ? translations.hintText : ''}
            visualPlaceholder={translations.textInputHint}
            onChange={(e) => handleTextInput(e?.toString().trim() ?? '')}
            debounce={500}
            maxLength={maxLength ?? TEXT_INPUT_MAX}
            minLength={minLength ?? 0}
            id="prefix-text-input"
            status={
              (prefix !== '' && (!prefixValid || inUse.data)) || error
                ? 'error'
                : 'default'
            }
            statusText={
              (prefix !== '' &&
                ((!prefixValid && translations.errorInvalid) ||
                  (inUse.data === true && translations.errorTaken))) ||
              ''
            }
            defaultValue={prefix}
            disabled={disabled}
            fullWidth={fullWidth}
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
