import { useTranslation } from 'next-i18next';
import React from 'react';
import { BasicBlock } from '@common/components/block';
import { Property } from '@app/common/interfaces/termed-data-types.interface';
import { getPropertyValue } from '@app/common/components/property-value/get-property-value';

export interface PropertyBlockProps {
  title?: React.ReactNode;
  property?: Property[];
  valueAccessor?: (property: Property) => string;
  delimiter?: string | false;
  extra?: React.ReactNode;
  id?: string;
}

export default function PropertyBlock({
  title,
  property,
  valueAccessor,
  delimiter = false,
  extra,
  id,
}: PropertyBlockProps) {
  const { i18n } = useTranslation('common');

  const children = getPropertyValue({
    property,
    valueAccessor,
    language: i18n.language,
    delimiter,
  });

  if (!children) {
    return null;
  }

  return (
    <BasicBlock title={title} extra={extra} id={id}>
      {children}
    </BasicBlock>
  );
}
