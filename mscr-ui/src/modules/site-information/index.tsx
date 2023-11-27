import { useTranslation } from 'next-i18next';
import { Heading } from 'suomifi-ui-components';
import { SiteTitle } from './site-information.styles';

export default function SiteInformationModule() {
  const { t } = useTranslation('common');

  return (
    <>
      <SiteTitle variant="h1">{t('landing.title')}</SiteTitle>
      <p>{t('landing.description')}</p>
      <Heading variant="h2">{t('landing.what-can-do')}</Heading>
      <ul>
        <li>{t('site-description-1')}</li>
        <li>{t('site-description-2')}</li>
        <li>{t('site-description-3')}</li>
        <li>{t('site-description-4')}</li>
        <li>{t('site-description-5')}</li>
        <li>{t('site-description-6')}</li>
      </ul>
    </>
  );
}
