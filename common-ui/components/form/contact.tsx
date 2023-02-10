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
import { ContactWrapper } from './contact.styles';

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
    optional: string;
  };
  disabled?: boolean;
}

export default function Contact({
  contact,
  setContact,
  translations,
  disabled,
}: ContactProps) {
  const [defaultContact] = useState(contact);

  return (
    <ContactWrapper>
      <Label optionalText={translations.optional}>{translations.label}</Label>
      <HintText>
        {translations.inputDescription1} {translations.inputDescription2}
      </HintText>

      <TextInput
        labelText={''}
        labelMode="hidden"
        visualPlaceholder={translations.inputPlaceholder}
        id="contact-input"
        defaultValue={defaultContact}
        onBlur={(e) => setContact(e.target.value ?? '')}
        disabled={disabled}
      />
    </ContactWrapper>
  );
}
