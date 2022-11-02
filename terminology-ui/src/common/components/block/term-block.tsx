import { useTranslation } from 'next-i18next';
import React from 'react';
import { Term } from '@app/common/interfaces/term.interface';
import TermModal from '@app/common/components/term-modal';
import MultilingualBlock, {
  MultilingualBlockItemMapper,
} from './multilingual-block';
import { TermWrapper } from './term-block.styles';
import { translateStatus } from '@app/common/utils/translation-helpers';

export interface TermBlockProps {
  title: React.ReactNode;
  data?: { term: Term; type: string }[];
  mapper?: MultilingualBlockItemMapper<{ term: Term; type: string }>;
  extra?: React.ReactNode;
}

export default function TermBlock({
  title,
  data,
  mapper,
  extra,
}: TermBlockProps) {
  const { t } = useTranslation('common');

  const defaultMapper: MultilingualBlockItemMapper<{
    term: Term;
    type: string;
  }> = ({ term, type }) => ({
    language: term.properties.prefLabel?.[0].lang ?? '',
    content: (
      <TermWrapper>
        <span lang={term.properties.prefLabel?.[0].lang}>
          <TermModal data={{ term: term, type: type }} />
        </span>
        <span>
          {type},{' '}
          {translateStatus(term.properties.status?.[0].value ?? 'DRAFT', t)}
        </span>
      </TermWrapper>
    ),
  });

  return (
    <MultilingualBlock<{ term: Term; type: string }>
      data={data}
      title={title}
      mapper={mapper ?? defaultMapper}
      extra={extra}
    />
  );
}
