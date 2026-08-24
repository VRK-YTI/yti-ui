import { useRouter } from 'next/router';
import { setLocaleCookie } from '../../utils/locale-cookie';

export type Locale = 'fi' | 'sv' | 'en';

export interface UseLocalesResult {
  locales: {
    locale: Locale;
    label: string;
    isCurrent: boolean;
    use: () => void;
  }[];
  currentLocale: { locale: Locale; label: string };
}

export default function useLocales(hideSv?: boolean): UseLocalesResult {
  const router = useRouter();
  const routerLocale = router.locale?.toLowerCase() ?? 'fi';
  const currentLocale = routerLocale === 'default' ? 'fi' : routerLocale;

  if (!['fi', 'sv', 'en'].includes(currentLocale)) {
    console.warn(`Unsupported locale: ${currentLocale}`);
  }

  let locales: { locale: Locale; label: string }[] = [
    { locale: 'fi', label: 'Suomeksi (FI)' },
    { locale: 'sv', label: 'På svenska (SV)' },
    { locale: 'en', label: 'In English (EN)' },
  ];

  if (hideSv) {
    locales = locales.filter(({ locale }) => locale !== 'sv');
  }

  return {
    locales: locales.map(({ locale, label }) => ({
      locale,
      label,
      isCurrent: currentLocale === locale,
      use: () => {
        setLocaleCookie(locale);
        router.push(
          { pathname: router.pathname, query: router.query },
          router.asPath,
          { locale }
        );
      },
    })),
    currentLocale: locales.filter(
      ({ locale }) => locale === currentLocale
    )?.[0],
  };
}
