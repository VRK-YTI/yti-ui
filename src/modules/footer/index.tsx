import { useTranslation } from 'react-i18next';
import { ExternalLink, Paragraph, Text } from 'suomifi-ui-components';
import Image from 'next/image';
import { FooterContentWrapper, FooterLinkWrapper } from './footer.style';
import { useBreakpoints } from '../../common/components/media-query/media-query-context';

/**
 * @deprecated | use footer from ~/common/components
 */

export default function Footer() {
  const { t } = useTranslation('common');
  const { breakpoint } = useBreakpoints();

  return (
    <>
      <FooterContentWrapper>
        <Image src="/logo-suomi.fi.png" width="254" height="70" alt="Logo" />
        <Paragraph>
          <Text>{t('terminology-footer-text')}</Text>
        </Paragraph>
      </FooterContentWrapper>

      <FooterLinkWrapper breakpoint={breakpoint}>
        <ExternalLink href="/" labelNewWindow={t('site-open-link-new-window')}>
          {t('terminology-footer-feedback')}
        </ExternalLink>
        <ExternalLink href="/" labelNewWindow={t('site-open-link-new-window')}>
          {t('terminology-footer-information-security')}
        </ExternalLink>
        <ExternalLink href="/" labelNewWindow={t('site-open-link-new-window')}>
          {t('terminology-footer-accessibility')}
        </ExternalLink>
      </FooterLinkWrapper>
    </>
  );
}
