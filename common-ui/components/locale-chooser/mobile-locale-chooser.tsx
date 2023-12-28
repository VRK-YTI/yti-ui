import React from 'react';
import { Link, Text } from 'suomifi-ui-components';
import {
  MobileMenuLanguageItem,
  MobileMenuLanguageSection,
} from './locale-chooser.styles';
import useLocales from './use-locales';

export default function MobileLocaleChooser({ hideSv }: { hideSv?: boolean }) {
  const { locales } = useLocales(hideSv);

  return (
    <MobileMenuLanguageSection>
      {locales.map(({ locale, label, isCurrent, use }) => (
        <MobileMenuLanguageItem key={locale} $active={isCurrent}>
          {isCurrent ? (
            <Text>{label}</Text>
          ) : (
            <Link href="#" onClick={use}>
              {label}
            </Link>
          )}
        </MobileMenuLanguageItem>
      ))}
    </MobileMenuLanguageSection>
  );
}
