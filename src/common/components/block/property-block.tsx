import { useTranslation } from 'next-i18next';
import React from 'react';
import { BasicBlock } from '.';
import { Property } from '../../interfaces/termed-data-types.interface';
import { getPropertyValue } from '../property-value/get-property-value';

export interface PropertyBlockProps {
  title?: React.ReactNode;
  property?: Property[];
  valueAccessor?: (property: Property) => string;
  fallbackLanguage?: string;
  delimiter?: string | false;
  extra?: React.ReactNode;
}

export default function PropertyBlock({
  title,
  property,
  valueAccessor,
  fallbackLanguage,
  delimiter = false,
  extra,
}: PropertyBlockProps) {
  const { i18n } = useTranslation('common');

  const children = getPropertyValue({
    property,
    valueAccessor,
    language: i18n.language,
    fallbackLanguage,
    delimiter,
  });

  if (!children) {
    return null;
  }

  return (
    <BasicBlock title={title} extra={extra}>
      {children}
    </BasicBlock>
  );
}
