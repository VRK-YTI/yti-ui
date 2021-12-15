import React from 'react';
import { useTranslation } from 'next-i18next';
import { Property } from '../../interfaces/termed-data-types.interface';

export interface PropertyValueProps {
  property?: Property[];
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
 */
export default function PropertyValue({ property }: PropertyValueProps) {
  const { i18n } = useTranslation('common');

  const value = [
    ...property?.filter(({ lang }) => lang === i18n.language) ?? [],
    ...property?.filter(({ lang }) => !lang) ?? [],
  ][0]?.value;

  if (! value) {
    return null;
  }

  return (
    <>{value}</>
  );
}
