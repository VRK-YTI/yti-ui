import { useTranslation } from 'next-i18next';
import { Paragraph } from 'suomifi-ui-components';
import { SiteTitle, TextBlock } from './site-information.styles';

export default function SiteInformationModule() {
  const { t } = useTranslation('common');

  return (
    <>
      <SiteTitle variant="h1">{t('site-title')}</SiteTitle>
      <TextBlock>
        <Paragraph>{t('site-description-1')}</Paragraph>
        <Paragraph>{t('site-description-2')}</Paragraph>
        <Paragraph>{t('site-description-3')}</Paragraph>
      </TextBlock>
    </>
  );
}
