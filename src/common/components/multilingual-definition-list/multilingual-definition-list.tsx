import { maxBy } from 'lodash';
import React from 'react';
import { MultilingualDefinitionListItem, MultilingualDefinitionListWrapper } from './multilingual-definition-list.styles';

/**
 * Error handling:
 * - if content is undefined should it be indicated
 *   somehow for the user other than empty string
 * -
 */

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
          {content}
        </MultilingualDefinitionListItem>
      ))}
    </MultilingualDefinitionListWrapper>
  );
}
