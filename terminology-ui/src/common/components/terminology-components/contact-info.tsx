import { Paragraph, Text } from 'suomifi-ui-components';
import { useBreakpoints } from 'yti-common-ui/media-query';
import {
  BlankFieldset,
  BlankLegend,
  TextInputSmBot,
} from './terminology-components.styles';
import { useTranslation } from 'next-i18next';
import { UpdateTerminology } from '@app/modules/new-terminology/update-terminology.interface';
import { EMAIL_MAX } from 'yti-common-ui/utils/constants';
import { useState } from 'react';
import isEmail from 'validator/lib/isEmail';

interface ContactInfoProps {
  update: ({ key, data }: UpdateTerminology) => void;
  userPosted: boolean;
  defaultValue?: string;
  disabled?: boolean;
}

export default function ContactInfo({
  update,
  userPosted,
  defaultValue,
  disabled,
}: ContactInfoProps) {
  const { t } = useTranslation('admin');
  const { isSmall } = useBreakpoints();
  const [contact, setContact] = useState(defaultValue ?? '');

  return (
    <BlankFieldset>
      <BlankLegend>
        <Paragraph>
          <Text variant="bold">{t('contact-information')}</Text>
        </Paragraph>
        <Paragraph mb="m">
          <Text>{t('contact-information-description')}</Text>
        </Paragraph>
      </BlankLegend>

      <TextInputSmBot
        labelText={t('contact-email')}
        hintText={t('contact-hint-text')}
        visualPlaceholder={t('contact-visual-placeholder')}
        $isSmall={isSmall ? true : undefined}
        onChange={(e) => setContact(e?.toString().trim() ?? '')}
        onBlur={() => update({ key: 'contact', data: contact })}
        type="text"
        defaultValue={contact}
        maxLength={EMAIL_MAX}
        id="contact-input"
        disabled={disabled}
        status={
          userPosted && contact !== '' && !isEmail(contact)
            ? 'error'
            : 'default'
        }
      />
    </BlankFieldset>
  );
}
