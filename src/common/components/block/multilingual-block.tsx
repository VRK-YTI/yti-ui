import { BasicBlock } from '.';
import MultilingualDefinitionList from '../multilingual-definition-list/multilingual-definition-list';

/**
 * Error handling:
 * - if title or extra has erroneus values
 *   should something else be returned?
 * -
 */

export type MultilingualBlockItemMapper<T> = (item: T) => {
  language: string;
  content: React.ReactNode;
};

export interface MultilingualBlockProps<T> {
  title: React.ReactNode;
  data?: T[];
  mapper: MultilingualBlockItemMapper<T>;
  extra?: React.ReactNode;
}

export default function MultilingualBlock<T>({
  title,
  data,
  mapper,
  extra,
}: MultilingualBlockProps<T>) {
  if (!data) {
    return null;
  }

  return (
    <BasicBlock title={title} extra={extra} largeGap>
      <MultilingualDefinitionList items={data.map(mapper)} />
    </BasicBlock>
  );
}
