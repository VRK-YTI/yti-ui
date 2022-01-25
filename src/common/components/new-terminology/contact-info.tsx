import { useState } from 'react';
import { Paragraph, Text } from 'suomifi-ui-components';
import { useBreakpoints } from '../media-query/media-query-context';
import { TextInputSmBot } from './new-terminology.styles';

export default function ContactInfo() {
  const { isSmall } = useBreakpoints();
  const [contact, setContact] = useState('');

  return (
    <>
      <Paragraph>
        <Text variant='bold'>
          Yhteydenottotiedot
        </Text>
      </Paragraph>
      <Paragraph marginBottomSpacing='m'>
        <Text>
          Organisaation yleinen sähköpostiosoite, johon käyttäjä voi antaa palautetta sanaston sisältöön liittyen. Älä käytä henkilökohtaista sähköpostiosoitetta.
        </Text>
      </Paragraph>
      <TextInputSmBot
        labelText='Yhteydenotto-osoite'
        hintText='Sanaston tiedoissa julkisesti näkyvä sähköpostiosoite.'
        visualPlaceholder='Esim. yllapito@example.org'
        isSmall={isSmall}
        onChange={e => setContact(e as string)}
        type='email'
      />
    </>
  );
}
