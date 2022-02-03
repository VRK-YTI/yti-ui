import { useTranslation } from 'react-i18next';
import { ExternalLink, Paragraph, Text } from 'suomifi-ui-components';
import Image from 'next/image';
import { FooterContentWrapper, FooterLinkWrapper, VersionInfo } from './footer.style';
import { useBreakpoints } from '../media-query/media-query-context';
import getConfig from 'next/config';
import { useRouter } from 'next/router';

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
        <Image src={useRouter().basePath + '/logo-suomi.fi.png'} width="254" height="70" alt="Logo" />
        <Paragraph>
          <Text>{t('terminology-footer-text')}</Text>
        </Paragraph>
      </FooterContentWrapper>

      <FooterLinkWrapper breakpoint={breakpoint}>
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
      <VersionInfo>
        {publicRuntimeConfig?.versionInfo}
      </VersionInfo>
    </>
  );
}
