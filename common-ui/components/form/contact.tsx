import { useState } from 'react';
import {
  HintText,
  Label,
  RadioButtonGroup,
  RadioButton,
  TextInput,
  Paragraph,
  Text,
} from 'suomifi-ui-components';

interface ContactProps {
  contact: string;
  setContact: (value: string) => void;
  translations: {
    label: string;
    labelHint: string;
    inputOptionLabel: string;
    email: string;
    undefined: string;
    inputDescription1: string;
    inputDescription2: string;
    inputLabel: string;
    inputPlaceholder: string;
  };
  disabled?: boolean;
}

export default function Contact({
  contact,
  setContact,
  translations,
  disabled,
}: ContactProps) {
  const [input, setInput] = useState(true);
  const [defaultContact] = useState(contact);

  const handleChange = (e: string) => {
    if (e !== 'email') {
      setInput(false);
      setContact(defaultContact);
      return;
    }

    setInput(true);
  };

  return (
    <>
      <div>
        <Label>{translations.label}</Label>
        <HintText>{translations.labelHint}</HintText>
      </div>

      <RadioButtonGroup
        labelText={translations.inputOptionLabel}
        name="feedback"
        defaultValue="email"
        id="feedback-type-group"
        onChange={(e) => handleChange(e)}
      >
        <RadioButton value="email" id="email-radio-button" disabled={disabled}>
          {translations.email}
        </RadioButton>
        <RadioButton
          value="undefined"
          id="undefined-radio-button"
          disabled={disabled}
        >
          {translations.undefined}
        </RadioButton>
      </RadioButtonGroup>

      {input && (
        <>
          <Paragraph>
            <Text smallScreen>
              {translations.inputDescription1}
              <br />
              {translations.inputDescription2}
            </Text>
          </Paragraph>

          <TextInput
            labelText={translations.inputLabel}
            visualPlaceholder={translations.inputPlaceholder}
            id="contact-input"
            defaultValue={defaultContact}
            onBlur={(e) => setContact(e.target.value ?? '')}
            disabled={disabled}
          />
        </>
      )}
    </>
  );
}
