import { useRouter } from 'next/router';

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
  const currentLocale = router.locale?.toLowerCase() ?? 'fi';

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
      use: () => router.push(router.asPath, router.asPath, { locale }),
    })),
    currentLocale: locales.filter(
      ({ locale }) => locale === currentLocale
    )?.[0],
  };
}
