import { Property } from '../../interfaces/termed-data-types.interface';
import MultilingualDefinitionList from '../multilingual-definition-list/multilingual-definition-list';
import {
  InfoBlockTitle,
  InfoBlockWrapper
} from './info-block.styles';

/**
 * Error handling:
 * - if title is missing should an indicator
 *   about missing value be shown to user
 */

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
      <InfoBlockTitle>
        {title}
      </InfoBlockTitle>
      <MultilingualDefinitionList
        items={data.map(({ lang, value }) => ({ language: lang, content: value }))}
      />
    </InfoBlockWrapper>
  );
}
