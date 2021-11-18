import { useTranslation } from 'react-i18next';
import { ExternalLink, Paragraph, Text } from 'suomifi-ui-components';
import Image from 'next/image';
import { LayoutProps } from '../../common/components/layout/layout-props';
import { FooterContentWrapper, FooterLinkWrapper } from './footer.style';

export default function Footer({ props }: { props: LayoutProps }) {
  const { t } = useTranslation('common');

  return (
    <>
      <FooterContentWrapper>
        <Image src="/logo-suomi.fi.png" width="254" height="70" alt="Logo" />
        <Paragraph>
          <Text>{t('terminology-footer-text')}</Text>
        </Paragraph>
      </FooterContentWrapper>

      <FooterLinkWrapper isSmall={props.isSmall}>
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
