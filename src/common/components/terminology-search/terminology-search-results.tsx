import Link from 'next/link';
import React from 'react';
import { TerminologyDTO, TerminologySearchResult } from '../../interfaces/terminology.interface';
import { SearchResultContainer } from './terminology-search-results.styles';
import { Link as DsLink } from 'suomifi-ui-components';

interface SearchResultProps {
  data: TerminologyDTO;
}

interface SearchResultsProps {
  results?: TerminologySearchResult;
}

function SearchResult({ data }: SearchResultProps) {
  const label = data.label.fi ?? data.label.en ?? data.uri;
  const contributor = data.contributors.length ?
    data.contributors[0].label.fi ??
    data.contributors[0].label.en ??
    data.contributors[0].label.sv :
    'Unknown contributor';

  return <SearchResultContainer>
    {contributor}
    <Link passHref href={'/terminology/' + data.id}>
      <DsLink href="">
        <div
          /* API highlights the keyword in search results with plain html */
          dangerouslySetInnerHTML={{ __html: label }} />
      </DsLink>
    </Link>
  </SearchResultContainer>;
}

export function TerminologySearchResults({ results }: SearchResultsProps) {
  return (
    <>
      {
        results?.terminologies ?
          results.terminologies
            // .map(x => { console.log(x); return x; })
            // .map((data) => data.label.fi ?? data.label.en ?? data.uri)
            .map((data, idx) =>
              <SearchResult key={idx} data={data} />
            ) :
          []
      }
    </>
  );
}
