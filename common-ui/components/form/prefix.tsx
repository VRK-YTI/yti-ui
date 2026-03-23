import { useEffect, useState } from 'react';
import { Label, Paragraph, Text } from 'suomifi-ui-components';
import { TEXT_INPUT_MAX } from '../../utils/constants';
import { PrefixContainer, TextInput } from './prefix.styles';
import { UseMutation } from '@reduxjs/toolkit/dist/query/react/buildHooks';
import { isValidIdentifier } from '../../utils/validation-utils';

interface PrefixProps {
  prefix: string;
  setPrefix: (value: string, valid?: boolean) => void;
  // Using 'any' here same way useMutation() is implemented
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inUseMutation: UseMutation<any>;
  typeInUri: string;
  error: boolean;
  translations: {
    label: string;
    hintText: string;
    textInputLabel: string;
    textInputHint: string;
    errorInvalid: string;
    errorTaken: string;
    uriPreview: string;
  };
  disabled?: boolean;
  fullWidth?: boolean;
  maxLength: number;
  minLength: number;
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
  maxLength,
  minLength,
}: PrefixProps) {
  const namespace = 'https://iri.suomi.fi';
  const [prefixValid, setPrefixValid] = useState(true);
  const [prefixInternal, setPrefixInternal] = useState(prefix);

  const [validatePrefix, inUse] = inUseMutation();

  const handleTextInput = (e: string) => {
    if (isValidIdentifier(e)) {
      setPrefixInternal(e);
      setPrefixValid(true);
      setPrefix(e, true);

      validatePrefix(e);
      return;
    }
    setPrefix(e, false);
    setPrefixValid(false);
  };

  useEffect(() => {
    if (!inUse.isLoading) {
      setPrefix(prefixInternal, inUse.data === false);
    }
  }, [inUse, prefixInternal]);

  return (
    <PrefixContainer id="prefix-container">
      <TextInput
        labelText={translations.textInputLabel}
        hintText={translations.hintText}
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

      <div>
        <Label>{translations.uriPreview}</Label>
        <Paragraph>
          <Text smallScreen>
            {namespace}/{typeInUri}/{prefix}
            {prefix && '/'}
          </Text>
        </Paragraph>
      </div>
    </PrefixContainer>
  );
}
