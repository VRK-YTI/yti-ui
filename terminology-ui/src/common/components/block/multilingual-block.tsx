import { BasicBlock } from 'yti-common-ui/block';
import MultilingualDefinitionList from '@app/common/components/multilingual-definition-list/multilingual-definition-list';

export type MultilingualBlockItemMapper<T> = (item: T) => {
  language: string;
  content: React.ReactNode;
};

export interface MultilingualBlockProps<T> {
  title: React.ReactNode;
  data?: T[];
  mapper: MultilingualBlockItemMapper<T>;
  extra?: React.ReactNode;
  id?: string;
}

export default function MultilingualBlock<T>({
  title,
  data,
  mapper,
  extra,
  id,
}: MultilingualBlockProps<T>) {
  if (
    !data ||
    (typeof data === 'string' && data === '') ||
    (Array.isArray(data) && data.length === 0)
  ) {
    return null;
  }

  return (
    <BasicBlock title={title} extra={extra} largeGap id={id}>
      <MultilingualDefinitionList items={data.map(mapper)} />
    </BasicBlock>
  );
}
