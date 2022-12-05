import { useBreakpoints } from '../media-query';
import SearchCountTags from './search-count-tags';
import { CardConcepts, ResultWrapper } from './search-results.styles';
import ResultCard from './result-card';
import { BaseIconKeys } from 'suomifi-ui-components';
import ResultCardExpander from './result-card-expander';
import SanitizedTextContent from '../sanitized-text-content';

export interface SearchResultData {
  id: string;
  contributors?: string[];
  description?: string;
  icon?: BaseIconKeys;
  status?: string;
  partOf?: string[];
  title: string;
  titleLink: string;
  type: string;
}

interface SearchResultsProps {
  data?: SearchResultData[];
  organizations?: {
    label: string;
    id: string;
  }[];
  domains?: {
    label: string;
    id: string;
  }[];
  partOfText?: string;
  noDescriptionText: string;
  noChip?: boolean;
  tagsTitle: string;
  tagsHiddenTitle: string;
  extra?: {
    expander: {
      buttonLabel: string;
      contentLabel: string;
      deepHits: {
        [key: string]: {
          label: string;
          id: string;
          uri?: string;
        }[];
      };
    };
  } |
  {
    other: {
      title: string;
      items: {
        [key: string]: string;
      };
    };
  };
}

export default function SearchResults({
  data,
  organizations,
  domains,
  partOfText,
  noDescriptionText,
  noChip,
  tagsTitle,
  tagsHiddenTitle,
  extra,
}: SearchResultsProps) {
  const { isSmall } = useBreakpoints();

  if (!data) {
    return null;
  }

  return (
    <>
      <SearchCountTags
        title={tagsTitle}
        hiddenTitle={tagsHiddenTitle}
        organizations={organizations}
        domains={domains}
      />
      <ResultWrapper $isSmall={isSmall} id="search-results">
        {data.map((d) => {
          return (
            <ResultCard
              key={d.id}
              description={d.description}
              title={d.title}
              titleLink={d.titleLink}
              type={d.type}
              contributors={d.contributors}
              icon={d.icon}
              status={d.status}
              partOf={d.partOf}
              partOfText={partOfText}
              noDescriptionText={noDescriptionText}
              noChip={noChip}
              extra={
                extra &&
                ('expander' in extra ?
                  extra.expander.deepHits[d.id] && <ResultCardExpander
                    buttonLabel={extra.expander.buttonLabel}
                    contentLabel={extra.expander.contentLabel}
                    deepHits={extra.expander.deepHits[d.id]}
                  />
                  :
                  extra.other.items[d.id] &&
                  <>
                    <CardConcepts value={extra.other.title}>
                      <SanitizedTextContent text={extra.other.items[d.id]} />
                    </CardConcepts>
                  </>
                )
              }
            />
          );
        })}
      </ResultWrapper>
    </>
  );
}
