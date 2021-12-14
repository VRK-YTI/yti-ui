import React from 'react';
import { MultilingualDefinitionListItem, MultilingualDefinitionListWrapper } from './multilingual-definition-list.styles';

export interface MultilingualTextBoxProps {
  items: {
    language: string;
    content: React.ReactNode;
  }[];
}

export default function MultilingualDefinitionList({ items }: MultilingualTextBoxProps) {
  return (
    <MultilingualDefinitionListWrapper>
      {items.map(({ language, content }, index) => (
        <MultilingualDefinitionListItem key={index} lang={language}>
          {content}
        </MultilingualDefinitionListItem>
      ))}
    </MultilingualDefinitionListWrapper>
  );
}
