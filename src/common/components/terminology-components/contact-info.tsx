import { useState } from 'react';
import { Paragraph, Text } from 'suomifi-ui-components';
import { useBreakpoints } from '@app/common/components/media-query/media-query-context';
import {
  BlankFieldset,
  BlankLegend,
  TextInputSmBot,
} from './terminology-components.styles';
import isEmail from 'validator/lib/isEmail';
import { useTranslation } from 'next-i18next';
import { UpdateTerminology } from '@app/modules/new-terminology/update-terminology.interface';
import { EMAIL_MAX } from '@app/common/utils/constants';

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
      update({ key: 'contact', data: [contact, true] });
    }
  };

  return (
    <BlankFieldset>
      <BlankLegend>
        <Paragraph>
          <Text variant="bold">{t('contact-information')}</Text>
        </Paragraph>
        <Paragraph marginBottomSpacing="m">
          <Text>{t('contact-information-description')}</Text>
        </Paragraph>
      </BlankLegend>

      <TextInputSmBot
        labelText={t('contact-email')}
        hintText={t('contact-hint-text')}
        visualPlaceholder={t('contact-visual-placeholder')}
        $isSmall={isSmall ? true : undefined}
        onChange={(e) => setContact(e as string)}
        onBlur={() => validateContact()}
        type="email"
        status={status === 'error' ? 'error' : 'default'}
        statusText={status === 'error' ? t('contact-email-invalid') : ''}
        maxLength={EMAIL_MAX}
      />
    </BlankFieldset>
  );
}
