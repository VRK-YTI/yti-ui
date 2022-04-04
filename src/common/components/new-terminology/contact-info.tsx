import { useState } from 'react';
import { Paragraph, Text } from 'suomifi-ui-components';
import { useBreakpoints } from '../media-query/media-query-context';
import { BlankFieldset, BlankLegend, TextInputSmBot } from './new-terminology.styles';
import isEmail from 'validator/lib/isEmail';

export default function ContactInfo({ update }: any) {
  const { isSmall } = useBreakpoints();
  const [contact, setContact] = useState('');
  const [status, setStatus] = useState<'default' | 'error'>('default');

  const validateContact = () => {
    if (contact !== '' && !isEmail(contact)) {
      setStatus('error');
      update('contact', [contact, false]);
    } else {
      setStatus('default');
      update('contact', [contact, contact !== '']);
    }
  };

  return (
    <BlankFieldset>
      <BlankLegend>
        <Paragraph>
          <Text variant="bold">Yhteydenottotiedot</Text>
        </Paragraph>
        <Paragraph marginBottomSpacing="m">
          <Text>
            Organisaation yleinen sähköpostiosoite, johon käyttäjä voi antaa
            palautetta sanaston sisältöön liittyen. Älä käytä henkilökohtaista
            sähköpostiosoitetta.
          </Text>
        </Paragraph>
      </BlankLegend>

      <TextInputSmBot
        labelText="Yhteydenotto-osoite"
        hintText="Sanaston tiedoissa julkisesti näkyvä sähköpostiosoite."
        visualPlaceholder="Esim. yllapito@example.org"
        isSmall={isSmall}
        onChange={(e) => setContact(e as string)}
        onBlur={() => validateContact()}
        type="email"
        status={status}
        statusText={
          status === 'error' ? 'Sähköposti ei ole oikeassa muodossa' : ''
        }
      />
    </BlankFieldset>
  );
}
