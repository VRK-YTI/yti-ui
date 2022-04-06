import { useState } from 'react';
import { Paragraph, Text } from 'suomifi-ui-components';
import { useBreakpoints } from '../media-query/media-query-context';
import { BlankFieldset, BlankLegend, TextInputSmBot } from './new-terminology.styles';
import isEmail from 'validator/lib/isEmail';
import { useTranslation } from 'next-i18next';
import { UpdateTerminology } from './update-terminology.interface';

interface ContactInfoProps {
  update: ({ key, data }: UpdateTerminology) => void;
  userPosted: boolean;
}

export default function ContactInfo({ update, userPosted }: ContactInfoProps) {
  const { t } = useTranslation('admin');
  const { isSmall } = useBreakpoints();
  const [contact, setContact] = useState('');
  const [status, setStatus] = useState<'default' | 'error'>('default');

  const validateContact = () => {
    if (contact !== '' && !isEmail(contact)) {
      setStatus('error');
      update({ key: 'contact', data: [contact, false] });
    } else {
      setStatus('default');
      update({ key: 'contact', data: [contact, contact !== ''] });
    }
  };

  return (
    <BlankFieldset>
      <BlankLegend>
        <Paragraph>
          <Text variant="bold">{t('contact-information')}</Text>
        </Paragraph>
        <Paragraph marginBottomSpacing="m">
          <Text>
            {t('contact-information-description')}
          </Text>
        </Paragraph>
      </BlankLegend>

      <TextInputSmBot
        labelText={t('contact-email')}
        hintText={t('contact-hint-text')}
        visualPlaceholder={t('contact-visual-placeholder')}
        isSmall={isSmall}
        onChange={(e) => setContact(e as string)}
        onBlur={() => validateContact()}
        type="email"
        status={(status === 'error' || (userPosted && !contact)) ? 'error' : 'default'}
        statusText={
          status === 'error' ? t('contact-email-invalid') : ''
        }
      />
    </BlankFieldset>
  );
}
