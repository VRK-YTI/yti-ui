import { useTranslation } from 'next-i18next';
import Head from 'next/head';

interface PageHeadProps {
  baseUrl: string;
  title?: string | (string | undefined)[];
  siteTitle?: string;
  description?: string;
  path?: string;
  children?: React.ReactNode;
}

export default function PageHead({
  baseUrl,
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
  const desc = description ? description : t('service-description');
  const url = path ? `${baseUrl}${path}` : baseUrl;
  const imageUri = `${baseUrl}/logo-suomi.fi.png`;

  return (
    <Head>
      <title>{currTitle}</title>
      <meta name="og:title" content={currTitle} />
      <meta name="description" content={desc} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={imageUri} />
      <link rel="shortcut icon" href="/favicon.ico" />
      {children}
    </Head>
  );
}
