import Link from 'next/link';
import React from 'react';
import { TerminologyDTO, TerminologySearchResult } from '../../interfaces/terminology.interface';
import { SearchResultContainer } from './terminology-search-results.styles';
import { Button, Icon, Link as DsLink, Text } from 'suomifi-ui-components';

interface SearchResultProps {
  data: TerminologyDTO;
}

interface SearchResultsProps {
  results?: TerminologySearchResult;
}

interface InfoDomain {
  id: string;
  label: {
    fi: 'string';
    en: 'string';
    sv: 'string';
  };
}

function SearchResult({ data }: SearchResultProps) {
  const label = data.label.fi ?? data.label.en ?? data.uri;
  const contributor = data.contributors.length ?
    data.contributors[0].label.fi ??
    data.contributors[0].label.en ??
    data.contributors[0].label.sv :
    'Unknown contributor';

  return <SearchResultContainer>
    <div>
      <Text smallScreen color='blackLight1'>{contributor}</Text>
    </div>
    <div>
      <Link passHref href={'/terminology/' + data.id}>
        <DsLink href="">
          <Icon icon="registers" color='hsl(212, 63%, 45%)' />
          &nbsp;
          <b><span dangerouslySetInnerHTML={{ __html: label }} /></b>
        </DsLink>
      </Link>
    </div>
    <div>
      <Text smallScreen color='blackLight1' variant='bold'>
        TERMINOLOGINEN SANASTO &middot; {data.status}
      </Text>
    </div>
    <div>
      <Text>{data.description.fi}</Text>
    </div>
    <div>
      <Text variant='bold'>Kuuluu tietoalueisiin</Text>
    </div>
    {data.informationDomains?.map((infoDomain: InfoDomain, index: number) => {
      return (
        <Button key={`${label}-infoDomain-${index}`}>
          {infoDomain.label.fi}
        </Button>
      );
    })}

  </SearchResultContainer>;
}

export function TerminologySearchResults({ results }: SearchResultsProps) {
  return (
    <>
      {
        results?.terminologies ?
          results.terminologies
            .map((data, idx) =>
              <SearchResult key={idx} data={data} />
            ) :
          []
      }
    </>
  );
}
