import { useRouter } from 'next/router';

export interface UseLocalesResult {
  locales: { locale: string, label: string, isCurrent: boolean, use: () => void }[];
  currentLocale: { locale: string, label: string };
}

export default function useLocales(): UseLocalesResult {
  const router = useRouter();
  const currentLocale = router.locale?.toLowerCase() ?? 'fi';

  if (!['fi', 'sv', 'en'].includes(currentLocale)) {
    console.warn(`Unsupported locale: ${currentLocale}`);
  }

  const locales = [
    { locale: 'fi', label: 'Suomeksi (FI)' },
    { locale: 'sv', label: 'På svenska (SV)' },
    { locale: 'en', label: 'In English (EN)' },
  ];

  return {
    locales: locales.map(({ locale, label }) => ({
      locale,
      label,
      isCurrent: currentLocale === locale,
      use: () => router.push(router.asPath, router.asPath, { locale }),
    })),
    currentLocale: locales.filter(({ locale }) => locale === currentLocale)?.[0],
  };
}
