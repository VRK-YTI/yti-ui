import {
  MultilingualBlockItem,
  MultilingualBlockWrapper,
} from './multilingual-block.styles';
import { v4 } from 'uuid';
import { maxBy } from 'lodash';

interface MultilingualBlockProps {
  data?: {
    lang: string;
    value: string | JSX.Element;
  }[];
}

export default function MultilingualBlock({ data }: MultilingualBlockProps) {
  if (!data) {
    return <></>;
  }

  const id = v4().slice(0, 8);
  const maxSize = maxBy(data, (item) => item.lang.length)?.lang.length ?? 0;

  return (
    <MultilingualBlockWrapper $maxSize={maxSize}>
      {data.map((d, idx) => (
        <MultilingualBlockItem
          key={`multilingual-block-${id}-item-${idx}`}
          lang={d.lang}
        >
          {d.value}
        </MultilingualBlockItem>
      ))}
    </MultilingualBlockWrapper>
  );
}
