import { useTranslation } from 'react-i18next';
import { ExternalLink, Paragraph, Text } from 'suomifi-ui-components';
import Image from 'next/image';
import { FooterContentWrapper, FooterLinkWrapper, VersionInfo } from './footer.style';
import { useBreakpoints } from '../media-query/media-query-context';
import getConfig from 'next/config';

export interface FooterProps {
  feedbackSubject?: string;
}

export default function Footer({ feedbackSubject }: FooterProps) {
  const { t } = useTranslation('common');
  const subject = encodeURIComponent(feedbackSubject ?? String(t('feedback-terminologies')));
  const { breakpoint } = useBreakpoints();
  const { publicRuntimeConfig } = getConfig();

  return (
    <>
      <FooterContentWrapper>
        <Image src="/logo-suomi.fi.png" width="254" height="70" alt="" aria-hidden />
        <Paragraph>
          <Text>{t('terminology-footer-text')}</Text>
        </Paragraph>
      </FooterContentWrapper>

      <FooterLinkWrapper breakpoint={breakpoint}>
        <ExternalLink
          href={`mailto:yhteentoimivuus@dvv.fi?subject=${subject}`}
          labelNewWindow={`${t('site-open-new-email')} yhteentoimivuus@dvv.fi`}
        >
          {t('terminology-footer-feedback')}
        </ExternalLink>
        <ExternalLink
          href="https://wiki.dvv.fi/display/YTIJD/Tietosuojaseloste"
          labelNewWindow={`${t('site-open-link-new-window')} wiki.dvv.fi/Tietosuojaseloste`}
        >
          {t('terminology-footer-information-security')}
        </ExternalLink>
        <ExternalLink
          href="https://wiki.dvv.fi/display/YTIJD/Saavutettavuusseloste"
          labelNewWindow={`${t('site-open-link-new-window')} wiki.dvv.fi/Saavutettavuusseloste`}
        >
          {t('terminology-footer-accessibility')}
        </ExternalLink>
      </FooterLinkWrapper>
      <VersionInfo aria-hidden>
        {publicRuntimeConfig?.versionInfo}
      </VersionInfo>
    </>
  );
}
