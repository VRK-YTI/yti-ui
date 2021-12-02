import { useRouter } from 'next/router';
import React from 'react';
import { LanguageMenu, LanguageMenuItem } from 'suomifi-ui-components';

export default function LanguageChooser() {
  const router = useRouter();

  const currentLocale = router.locale?.toLowerCase() || 'fi';
  const languageMenuItems = {
    fi: 'Suomeksi (FI)',
    sv: 'På svenska (SV)',
    en: 'In English (EN)'
  } as { [key: string]: string };

  return (
    <LanguageMenu name={languageMenuItems[currentLocale]}>
      <LanguageMenuItem
        onSelect={() => {
          router.push(router.asPath, router.asPath, {
            locale: 'fi',
          });
        }}
        selected={currentLocale === 'fi'}
      >
        {languageMenuItems['fi']}
      </LanguageMenuItem>
      <LanguageMenuItem
        onSelect={() => {
          router.push(router.asPath, router.asPath, {
            locale: 'sv',
          });
        }}
        selected={currentLocale === 'sv'}
      >
        {languageMenuItems['sv']}
      </LanguageMenuItem>
      <LanguageMenuItem
        onSelect={() => {
          router.push(router.asPath, router.asPath, {
            locale: 'en',
          });
        }}
        selected={currentLocale === 'en'}
      >
        {languageMenuItems['en']}
      </LanguageMenuItem>
    </LanguageMenu>
  );
}
