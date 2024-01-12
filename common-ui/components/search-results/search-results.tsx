import { useBreakpoints } from '../media-query';
import SearchCountTags from './search-count-tags';
import { CardConcepts, ResultWrapper } from './search-results.styles';
import ResultCard from './result-card';
import ResultCardExpander from './result-card-expander';
import SanitizedTextContent from '../sanitized-text-content';
import { ReactNode } from 'react';
import ResultCardTypedExpander from './result-card-typed-expander';
import { TFunction } from 'next-i18next';

export interface SearchResultData {
  id: string;
  contributors?: string[];
  description?: string;
  icon?: ReactNode;
  status?: string;
  partOf?: string[];
  identifier?: string;
  version?: string;
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
  types?: {
    label: string;
    id: string;
  }[];
  partOfText?: string;
  noDescriptionText: string;
  noChip?: boolean;
  noVersion?: boolean;
  tagsTitle: string;
  tagsHiddenTitle: string;
  withDefaultStatuses?: string[];
  extra?:
    | {
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
      }
    | {
        other: {
          title: string;
          items: {
            [key: string]: string;
          };
        };
      }
    | {
        typedExpander: {
          translateResultType: (type: string, t: TFunction) => string;
          translateGroupType: (type: string, t: TFunction) => string;
          deepHits: {
            [key: string]: {
              type: string;
              label: string;
              id: string;
              uri: string;
            }[];
          };
        };
      };
}

export default function SearchResults({
  data,
  organizations,
  domains,
  types,
  partOfText,
  noDescriptionText,
  noChip,
  noVersion,
  tagsTitle,
  tagsHiddenTitle,
  withDefaultStatuses,
  extra,
}: SearchResultsProps) {
  const { isSmall } = useBreakpoints();

  if (!data) {
    return null;
  }

  function renderExtra(id: string) {
    if (!extra || !id) {
      return;
    }

    if ('expander' in extra && extra.expander.deepHits[id]) {
      return (
        <ResultCardExpander
          buttonLabel={extra.expander.buttonLabel}
          contentLabel={extra.expander.contentLabel}
          deepHits={extra.expander.deepHits[id]}
        />
      );
    } else if ('typedExpander' in extra && extra.typedExpander.deepHits[id]) {
      return (
        <ResultCardTypedExpander
          translateGroupType={extra.typedExpander.translateGroupType}
          translateResultType={extra.typedExpander.translateResultType}
          deepHits={extra.typedExpander.deepHits[id]}
        />
      );
    } else if ('other' in extra) {
      return (
        <>
          <CardConcepts value={extra.other.title}>
            <SanitizedTextContent text={extra.other.items[id]} />
          </CardConcepts>
        </>
      );
    }
  }

  return (
    <>
      <SearchCountTags
        title={tagsTitle}
        hiddenTitle={tagsHiddenTitle}
        organizations={organizations}
        types={types}
        withDefaultStatuses={withDefaultStatuses}
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
              version={d.version}
              identifier={d.identifier}
              partOfText={partOfText}
              noDescriptionText={noDescriptionText}
              noChip={noChip}
              noVersion={noVersion}
              extra={renderExtra(d.id)}
            />
          );
        })}
      </ResultWrapper>
    </>
  );
}
