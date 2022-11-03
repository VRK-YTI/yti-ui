import { ExternalLink, Paragraph, Text } from 'suomifi-ui-components';
import {
  FooterContentWrapper,
  FooterLinkWrapper,
  VersionInfo,
} from './footer.styles';
import { useBreakpoints } from '../media-query';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from '../theme';
import CommonWrapper from '../wrapper';

export interface FooterProps {
  t: any;
  feedbackSubject?: string;
  versionInfo?: string;
}

function Footer({ t, feedbackSubject, versionInfo }: FooterProps) {
  const subject = encodeURIComponent(
    feedbackSubject ?? String(t('feedback-terminologies'))
  );
  const { breakpoint } = useBreakpoints();

  return (
    <>
      <FooterContentWrapper id="footer">
        <img
          src="/logo-suomi.fi.png"
          width="138"
          height="38"
          alt=""
          aria-hidden
        />
        <Paragraph>
          <Text>{t('terminology-footer-text')}</Text>
        </Paragraph>
      </FooterContentWrapper>

      <FooterLinkWrapper $breakpoint={breakpoint}>
        <ExternalLink
          href={`mailto:yhteentoimivuus@dvv.fi?subject=${subject}`}
          labelNewWindow={`${t('site-open-new-email')} yhteentoimivuus@dvv.fi`}
        >
          {t('terminology-footer-feedback')}
        </ExternalLink>
        <ExternalLink
          href="https://wiki.dvv.fi/display/YTIJD/Tietosuojaseloste"
          labelNewWindow={`${t(
            'site-open-link-new-window'
          )} wiki.dvv.fi/Tietosuojaseloste`}
        >
          {t('terminology-footer-information-security')}
        </ExternalLink>
        <ExternalLink
          href="https://wiki.dvv.fi/display/YTIJD/Saavutettavuusseloste"
          labelNewWindow={`${t(
            'site-open-link-new-window'
          )} wiki.dvv.fi/Saavutettavuusseloste`}
        >
          {t('terminology-footer-accessibility')}
        </ExternalLink>
      </FooterLinkWrapper>
      <VersionInfo aria-hidden>{versionInfo}</VersionInfo>
    </>
  );
}

export default CommonWrapper(Footer)
