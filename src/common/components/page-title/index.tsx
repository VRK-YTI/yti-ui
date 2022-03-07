import { useTranslation } from 'next-i18next';
import Title from './title';

export interface PageTitleProps {
  title?: string | (string | undefined)[];
  siteTitle?: string;
}

export default function PageTitle({ title, siteTitle }: PageTitleProps) {
  const { t } = useTranslation();
  const defaultSiteTitle = t('site-title');

  if (! Array.isArray(title)) {
    title = [title];
  }

  return (
    <Title parts={[
      ...title,
      siteTitle ?? defaultSiteTitle
    ]} />
  );
}

