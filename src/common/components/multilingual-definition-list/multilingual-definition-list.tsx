import { maxBy } from 'lodash';
import React from 'react';
import TextLinks from '../text-links';
import { MultilingualDefinitionListItem, MultilingualDefinitionListWrapper } from './multilingual-definition-list.styles';

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
          {typeof content === 'string' ? TextLinks({text: content}) : content}
        </MultilingualDefinitionListItem>
      ))}
    </MultilingualDefinitionListWrapper>
  );
}
