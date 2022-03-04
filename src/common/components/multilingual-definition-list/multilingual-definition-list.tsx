import { maxBy } from 'lodash';
import React from 'react';
import { MultilingualDefinitionListItem, MultilingualDefinitionListWrapper } from './multilingual-definition-list.styles';
import SanitizedTextContent from '../sanitized-text-content';

export interface MultilingualTextBoxProps {
  items: {
    language: string;
    content: React.ReactNode;
  }[];
}

export default function MultilingualDefinitionList({ items }: MultilingualTextBoxProps) {
  const maxSize = maxBy(items, (item) => item.language.length )?.language.length ?? 0;

  return (
    <MultilingualDefinitionListWrapper maxSize={maxSize}>
      {items.map(({ language, content }, index) => (
        <MultilingualDefinitionListItem key={index} lang={language}>
          {typeof content === 'string' ? <SanitizedTextContent text={content} /> : content}
        </MultilingualDefinitionListItem>
      ))}
    </MultilingualDefinitionListWrapper>
  );
}
