import React from 'react';
import { useTranslation } from 'next-i18next';
import { Property } from '../../interfaces/termed-data-types.interface';

export interface PropertyValueProps {
  property?: Property[];
  fallbackLanguage?: string;
}

export function getPropertyValue(
  property: Property[] | undefined,
  locale: string = '',
  fallbackLanguage: string = ''
): string | undefined {
  return [
    ...property?.filter(({ lang }) => lang === locale) ?? [],
    ...property?.filter(({ lang }) => lang === fallbackLanguage) ?? [],
    ...property?.filter(({ lang }) => !lang) ?? [],
  ][0]?.value;
}

/**
 * If property is localized, return value that matches to current locale or null if not found.
 * If property is not localized, return first value that doesn't have a locale or null if not found.
 *
 * <PropertyValue property={[{ lang: '', value: 'DRAFT' }]} />
 *
 * This renders always as 'DRAFT'.
 *
 * <PropertyValue property={[{ lang: 'en', value: 'This is a test.' }]} />
 *
 * If current language is English, this renders as 'This is a test.'.
 * If current locale is not English, this renders as null.
 *
 * <PropertyValue property={[{ lang: 'en', value: 'This is a test.' }]} fallbackLocale="en" />
 *
 * If current language is English, this renders as 'This is a test.'.
 * If current locale is not English, fallback language is used, and this renders as 'This is a test'.
 */
export default function PropertyValue({ property, fallbackLanguage }: PropertyValueProps) {
  const { i18n } = useTranslation('common');

  const value = getPropertyValue(property, i18n.language, fallbackLanguage);

  if (! value) {
    return null;
  }

  return (
    <>{value}</>
  );
}
