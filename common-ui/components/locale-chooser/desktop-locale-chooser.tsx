import React from 'react';
import { LanguageMenu, LanguageMenuItem } from 'suomifi-ui-components';
import { DesktopLocaleChooserWrapper } from './locale-chooser.styles';
import useLocales from './use-locales';

export default function DesktopLocaleChooser({ noFlex }: { noFlex?: boolean }) {
  const { locales, currentLocale } = useLocales();

  return (
    <DesktopLocaleChooserWrapper id="locale-picker" $noFlex={noFlex}>
      <LanguageMenu name={currentLocale.label}>
        {locales.map(({ locale, label, isCurrent, use }) => (
          <LanguageMenuItem key={locale} selected={isCurrent} onSelect={use}>
            {label}
          </LanguageMenuItem>
        ))}
      </LanguageMenu>
    </DesktopLocaleChooserWrapper>
  );
}
