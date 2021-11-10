import Link from 'next/link';
import React from 'react';
import { InformationDomainDTO, TerminologyDTO, TerminologySearchResult } from '../../interfaces/terminology.interface';
import { SearchResultContainer, SearchResultsContainer } from './terminology-search-results.styles';
import { Icon, Link as DsLink, Text } from 'suomifi-ui-components';
import { useTranslation } from 'react-i18next';

interface SearchResultProps {
  data: TerminologyDTO;
}

interface SearchResultsProps {
  results?: TerminologySearchResult;
}

function SearchResult({ data }: SearchResultProps) {
  const { t, i18n } = useTranslation('common');
  const label = data.label[i18n.language] ?? data.label.fi ?? data.uri;
  const contributor = data.contributors.length ?
    data.contributors[0].label[i18n.language] ??
    data.contributors[0].label.fi :
    'Unknown contributor';
  const description = data.description[i18n.language] ?? data.description.fi ?? '';

  return (
    <SearchResultContainer>
      <div className='contributor'>
        {contributor}
      </div>
      <div>
        <Link passHref href={'/terminology/' + data.id}>
          <DsLink href="">
            <Icon icon="registers" color='hsl(212, 63%, 45%)' />
            <span dangerouslySetInnerHTML={{ __html: label }} className='label' />
          </DsLink>
        </Link>
      </div>
      <span className='category'>
        {t('terminology-search-results-terminology').toUpperCase()} &middot;
      </span>
      <span className='status'>
        {t(`terminology-search-results-${data.status}`).toUpperCase()}
      </span>
      <div className='description'>
        <Text>{description}</Text>
      </div>
      <div>
        <Text>
          <b>
            {t('terminology-search-results-information-domains').toUpperCase()}:
          </b>
          {data.informationDomains?.map((infoDomain: InformationDomainDTO, idx: number) => {
            if (data.informationDomains.length > 1) {
              return (
                idx > 0 ?
                  <span key={`${label}-infoDomain-${idx}`}>
                    {`${', '}${infoDomain.label[i18n.language as keyof typeof infoDomain.label]}`}
                  </span>
                  :
                  <span key={`${label}-infoDomain-${idx}`}>
                    {`${' '}${infoDomain.label[i18n.language as keyof typeof infoDomain.label]}`}
                  </span>
              );
            } else {
              return (
                <span key={`${label}-infoDomain-${idx}`}>
                  {`${' '}${infoDomain.label[i18n.language as keyof typeof infoDomain.label]}`}
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
    <SearchResultsContainer>
      {
        results?.terminologies ?
          results.terminologies
            .map((data, idx) =>
              <SearchResult key={idx} data={data} />
            ) :
          []
      }
    </SearchResultsContainer>
  );
}
