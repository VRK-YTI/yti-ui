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
        <li>{t('landing.bullet-1')}</li>
        <li>{t('landing.bullet-2')}</li>
        {/*<li>{t('landing.bullet-3')}</li>*/}
        {/*<li>{t('landing.bullet-4')}</li>*/}
        <li>{t('landing.bullet-5')}</li>
        <li>{t('landing.bullet-6')}</li>
      </ul>
    </>
  );
}
