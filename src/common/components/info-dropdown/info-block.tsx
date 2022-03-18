import { Property } from '../../interfaces/termed-data-types.interface';
import MultilingualDefinitionList from '../multilingual-definition-list/multilingual-definition-list';
import { InfoBlockTitle, InfoBlockWrapper } from './info-block.styles';

interface InfoBlockProps {
  data?: Property[];
  title: string;
}

export default function InfoBlock({ data, title }: InfoBlockProps) {
  if (!data) {
    return null;
  }

  return (
    <InfoBlockWrapper>
      <InfoBlockTitle>{title}</InfoBlockTitle>
      <MultilingualDefinitionList
        items={data.map(({ lang, value }) => ({
          language: lang,
          content: value,
        }))}
      />
    </InfoBlockWrapper>
  );
}
