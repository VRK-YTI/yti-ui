import { useTranslation } from 'next-i18next';
import React from 'react';
import { Term } from '../../interfaces/term.interface';
import TermModal from '../term-modal';
import MultilingualBlock, { MultilingualBlockItemMapper } from './multilingual-block';

export interface TermBlockProps {
  title: React.ReactNode;
  data?: { term: Term, type: string }[];
  mapper?: MultilingualBlockItemMapper<{ term: Term, type: string }>;
  extra?: React.ReactNode;
}

export default function TermBlock({
  title,
  data,
  mapper,
  extra,
}: TermBlockProps) {
  const { t } = useTranslation('common');

  const defaultMapper: MultilingualBlockItemMapper<{ term: Term, type: string }> = ({ term, type }) => ({
    language: term.properties.prefLabel?.[0].lang ?? '',
    content: (
      <span>
        <span
          style={{ display: 'inline-block', minWidth: '40%' }}
          lang={term.properties.prefLabel?.[0].value}
        >
          <TermModal data={{ term: term, type: type }} />
        </span>
        <span>{type}, {t(term.properties.status?.[0].value ?? '')}</span>
      </span>
    ),
  });

  return (
    <MultilingualBlock<{ term: Term, type: string }>
      data={data}
      title={title}
      mapper={mapper ?? defaultMapper}
      extra={extra}
    />
  );
}
