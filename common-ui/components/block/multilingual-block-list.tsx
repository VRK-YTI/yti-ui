import {
  MultilingualBlockItem,
  MultilingualBlockWrapper,
} from './multilingual-block.styles';
import { v4 } from 'uuid';
import { maxBy } from 'lodash';
import SanitizedTextContent from '../../components/sanitized-text-content';

interface MultilingualBlockProps {
  data?: {
    language: string;
    value: string;
  }[];
  renderHtml?: boolean;
}

export default function MultilingualBlockList({
  data,
  renderHtml,
}: MultilingualBlockProps) {
  if (!data) {
    return <></>;
  }

  const id = v4().slice(0, 8);
  const maxSize =
    maxBy(data, (item) => item.language.length)?.language.length ?? 0;

  return (
    <MultilingualBlockWrapper $maxSize={maxSize}>
      {data.map((d, idx) => (
        <MultilingualBlockItem
          key={`multilingual-block-${id}-item-${idx}`}
          lang={d.language}
        >
          {renderHtml ? <SanitizedTextContent text={d.value} /> : d.value}
        </MultilingualBlockItem>
      ))}
    </MultilingualBlockWrapper>
  );
}
