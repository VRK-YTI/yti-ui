import React from 'react';
import { LanguageMenu, LanguageMenuItem } from 'suomifi-ui-components';
import { DesktopLocaleChooserWrapper } from './locale-chooser.styles';
import useLocales from './use-locales';
import { useTranslation } from 'next-i18next';

export default function DesktopLocaleChooser({ noFlex }: { noFlex?: boolean }) {
  const { locales, currentLocale } = useLocales();
  const { t } = useTranslation('common');

  return (
    <DesktopLocaleChooserWrapper id="locale-picker" $noFlex={noFlex}>
      <LanguageMenu
        buttonText={currentLocale.label}
        aria-label={t('change-language-selected-language', {
          selectedLanguage: currentLocale.label,
        })}
      >
        {locales.map(({ locale, label, isCurrent, use }) => (
          <LanguageMenuItem
            key={locale}
            selected={isCurrent}
            lang={currentLocale.locale}
            onSelect={use}
          >
            {label}
          </LanguageMenuItem>
        ))}
      </LanguageMenu>
    </DesktopLocaleChooserWrapper>
  );
}
