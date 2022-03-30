import React from 'react';
import { useTranslation } from 'next-i18next';
import { Property } from '@app/common/interfaces/termed-data-types.interface';
import { getPropertyValue } from './get-property-value';

export interface PropertyValueProps {
  property?: Property[];
  valueAccessor?: (property: Property) => string;
  fallbackLanguage?: string;
  delimiter?: string | false;
  fallback?: string;
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
 *
 * <PropertyValue property={[{ lang: '', value: 'Value 1' }, { lang: '', value: 'Value 2' }]} delimiter=", " />
 *
 * This renders always as 'Value 1, Value 2'.
 */
export default function PropertyValue({
  property,
  valueAccessor,
  fallbackLanguage,
  delimiter = false,
  fallback,
}: PropertyValueProps) {
  const { i18n } = useTranslation('common');

  const value = getPropertyValue({
    property,
    valueAccessor,
    language: i18n.language,
    fallbackLanguage,
    delimiter,
  });

  if (!value) {
    return <>{fallback}</>;
  }

  return <>{value}</>;
}
