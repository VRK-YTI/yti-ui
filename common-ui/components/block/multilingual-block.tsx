import {
  MultilingualBlockItem,
  MultilingualBlockWrapper,
} from './multilingual-block.styles';
import { v4 } from 'uuid';
import { maxBy } from 'lodash';
import SanitizedTextContent from '../../components/sanitized-text-content';
import { compareLocales } from '../../utils/compare-locales';

interface MultilingualBlockProps {
  data: { [key: string]: string };
  renderHtml?: boolean;
}

export default function MultilingualBlock({
  data,
  renderHtml,
}: MultilingualBlockProps) {
  if (!data) {
    return <></>;
  }
  const id = v4().slice(0, 8);
  const maxSize = maxBy(Object.keys(data), (key) => key.length)?.length ?? 0;

  const sortedData =
    Object.keys(data)
      ?.slice()
      .sort((t1, t2) => compareLocales(t1, t2))
      .reduce((result, lang) => {
        result[lang] = data[lang];
        return result;
      }, {} as { [key: string]: string }) ?? {};

  return (
    <MultilingualBlockWrapper $maxSize={maxSize}>
      {Object.keys(sortedData).map((key, idx) => (
        <MultilingualBlockItem
          key={`multilingual-block-${id}-item-${idx}`}
          lang={key}
        >
          {renderHtml ? <SanitizedTextContent text={data[key]} /> : data[key]}
        </MultilingualBlockItem>
      ))}
    </MultilingualBlockWrapper>
  );
}
