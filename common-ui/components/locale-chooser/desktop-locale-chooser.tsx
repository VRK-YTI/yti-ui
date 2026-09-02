import React from 'react';
import { Label, LanguageMenu, LanguageMenuItem } from 'suomifi-ui-components';
import {
  DesktopLocaleChooserWrapper,
  LanguageMenuLabel,
} from './locale-chooser.styles';
import useLocales from './use-locales';
import { useTranslation } from 'next-i18next';

export default function DesktopLocaleChooser({
  noFlex,
  hideSv,
  showLanguageMenuLabel,
}: {
  noFlex?: boolean;
  hideSv?: boolean;
  showLanguageMenuLabel?: boolean;
}) {
  const { locales, currentLocale } = useLocales(hideSv);
  const { t } = useTranslation('common');

  return (
    <DesktopLocaleChooserWrapper id="locale-picker" $noFlex={noFlex}>
      {showLanguageMenuLabel && (
        <LanguageMenuLabel>
          {t('change-ui-language-visible-label')}
        </LanguageMenuLabel>
      )}
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
