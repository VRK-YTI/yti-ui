import { Property } from '@app/common/interfaces/termed-data-types.interface';
import MultilingualBlock, {
  MultilingualBlockItemMapper,
} from './multilingual-block';

export interface MultilingualPropertyBlockProps {
  title: React.ReactNode;
  data?: Property[];
  mapper?: MultilingualBlockItemMapper<Property>;
  extra?: React.ReactNode;
}

const defaultMapper: MultilingualBlockItemMapper<Property> = ({
  lang,
  value,
}) => ({
  language: lang,
  content: value,
});

export default function MultilingualPropertyBlock({
  title,
  data,
  mapper = defaultMapper,
  extra,
}: MultilingualPropertyBlockProps) {
  return (
    <MultilingualBlock<Property>
      data={data}
      title={title}
      mapper={mapper}
      extra={extra}
    />
  );
}
