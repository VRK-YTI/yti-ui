import { useTranslation } from 'next-i18next';
import Head from 'next/head';

interface PageHeadProps {
  title?: string | (string | undefined)[];
  siteTitle?: string;
  description?: string;
  path?: string;
  children?: React.ReactNode;
}

export default function PageHead({
  title,
  siteTitle,
  description,
  path,
  children,
}: PageHeadProps) {
  const { t } = useTranslation('common');
  const currSiteTitle = siteTitle ? siteTitle : t('site-title');
  const pageTitles = Array.isArray(title) ? title : [title];
  const currTitle = [...pageTitles, currSiteTitle].filter(Boolean).join(' | ');
  const desc = description ?? t('terminology-search-info');
  const url = path
    ? `https://sanastot.suomi.fi${path}`
    : 'https://sanastot.suomi.fi';

  return (
    <Head>
      <title>{currTitle}</title>
      <meta name="og:title" content={currTitle} />
      <meta name="description" content={desc} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      {children}
    </Head>
  );
}
