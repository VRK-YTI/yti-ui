import { Paragraph, Text } from 'suomifi-ui-components';
import { useBreakpoints } from '@app/common/components/media-query/media-query-context';
import {
  BlankFieldset,
  BlankLegend,
  TextInputSmBot,
} from './terminology-components.styles';
import { useTranslation } from 'next-i18next';
import { UpdateTerminology } from '@app/modules/new-terminology/update-terminology.interface';
import { EMAIL_MAX } from '@app/common/utils/constants';
import { useState } from 'react';

interface ContactInfoProps {
  update: ({ key, data }: UpdateTerminology) => void;
  userPosted: boolean;
  defaultValue?: string;
}

export default function ContactInfo({
  update,
  userPosted,
  defaultValue,
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
        <Paragraph marginBottomSpacing="m">
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
      />
    </BlankFieldset>
  );
}
