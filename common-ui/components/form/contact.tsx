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
}

export default function Contact({ contact, setContact }: ContactProps) {
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
        <Label>Palaute</Label>
        <HintText>
          Voit pyytää käyttäjää antamaan palautetta tie tomallista.
        </HintText>
      </div>

      <RadioButtonGroup
        labelText="Palautteen vastaanottotapa"
        name="feedback"
        defaultValue="email"
        id="feedback-type-group"
        onChange={(e) => handleChange(e)}
      >
        <RadioButton value="email" id="email-radio-button">
          Sähköposti
        </RadioButton>
        <RadioButton value="undefined" id="undefined-radio-button">
          Ei vielä tiedossa
        </RadioButton>
      </RadioButtonGroup>

      {input && (
        <>
          <Paragraph>
            <Text>
              Anna organisaation yleinen sähköpostiosoite, johon käyttäjä voi
              antaa palautetta tietomallista.
              <br />
              Älä käytä henkilökohtaista sähköpostiosoitetta.
            </Text>
          </Paragraph>

          <TextInput
            labelText="Organisaation yleinen sähköpostiosoite"
            visualPlaceholder="Esim. yllapito@example.org"
            id="contact-input"
            defaultValue={defaultContact}
            onBlur={(e) => setContact(e.target.value ?? '')}
          />
        </>
      )}
    </>
  );
}
