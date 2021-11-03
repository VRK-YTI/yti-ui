import Link from 'next/link';
import React from 'react';
import { TerminologyDTO, TerminologySearchResult } from '../../interfaces/terminology.interface';
import { SearchResultContainer } from './terminology-search-results.styles';
import { Icon, Link as DsLink, Text } from 'suomifi-ui-components';

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

  return (
    <SearchResultContainer>
      <div className='contributor'>
        <Text smallScreen color='blackLight1'>{contributor}</Text>
      </div>
      <div>
        <Link passHref href={'/terminology/' + data.id}>
          <DsLink href="">
            <Icon icon="registers" color='hsl(212, 63%, 45%)' />
            &nbsp;
            <span dangerouslySetInnerHTML={{ __html: label }} className='label' />
          </DsLink>
        </Link>
      </div>
      <div className='status'>
        <Text smallScreen color='blackLight1' variant='bold'>
          TERMINOLOGINEN SANASTO &middot; {data.status}
        </Text>
      </div>
      <div className='description'>
        <Text>{data.description.fi}</Text>
      </div>
      <div>
        <Text><b>Tietoalueet:</b>
          {data.informationDomains?.map((infoDomain: InfoDomain, idx: number) => {
            if (data.informationDomains.length > 1) {
              return (
                idx > 0 ?
                  <span key={`${label}-infoDomain-${idx}`}>
                    {`${', '}${infoDomain.label.fi}`}
                  </span>
                  :
                  <span key={`${label}-infoDomain-${idx}`}>
                    {`${' '}${infoDomain.label.fi}`}
                  </span>
              );
            } else {
              return (
                <span key={`${label}-infoDomain-${idx}`}>
                  {`${' '}${infoDomain.label.fi}`}
                </span>
              );
            }
          })}
        </Text>
      </div>

    </SearchResultContainer>
  );
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
