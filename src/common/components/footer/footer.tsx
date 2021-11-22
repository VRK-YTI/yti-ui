import { useTranslation } from 'react-i18next';
import { ExternalLink, Paragraph, Text } from 'suomifi-ui-components';
import Image from 'next/image';
import { LayoutProps } from '../../../layouts/layout-props';
import { FooterContentWrapper, FooterLinkWrapper } from './footer.style';

export interface FooterProps {
  props: LayoutProps;
  feedbackSubject?: string;
}

export default function Footer({ props, feedbackSubject }: FooterProps) {
  const { t } = useTranslation('common');
  const subject = encodeURIComponent(feedbackSubject ?? String(t('feedback-terminologies')));

  return (
    <>
      <FooterContentWrapper>
        <Image src="/logo-suomi.fi.png" width="254" height="70" alt="Logo" />
        <Paragraph>
          <Text>{t('terminology-footer-text')}</Text>
        </Paragraph>
      </FooterContentWrapper>

      <FooterLinkWrapper isSmall={props.isSmall}>
        <ExternalLink
          href={`mailto:yhteentoimivuus@dvv.fi?subject=${subject}`}
          labelNewWindow={t('site-open-link-new-window')}
        >
          {t('terminology-footer-feedback')}
        </ExternalLink>
        <ExternalLink
          href="https://wiki.dvv.fi/display/YTIJD/Tietosuojaseloste"
          labelNewWindow={t('site-open-link-new-window')}
        >
          {t('terminology-footer-information-security')}
        </ExternalLink>
        <ExternalLink
          href="https://wiki.dvv.fi/display/YTIJD/Saavutettavuusseloste"
          labelNewWindow={t('site-open-link-new-window')}
        >
          {t('terminology-footer-accessibility')}
        </ExternalLink>
      </FooterLinkWrapper>
    </>
  );
}
