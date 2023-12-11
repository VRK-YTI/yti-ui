import {
  FacetsWrapper,
  ResultsWrapper,
  SearchContainer,
  CloseButton,
} from '@app/modules/search-screen/search-screen.styles';
import SearchResult from '@app/common/components/search-result';
import { useGetMscrSearchResultsQuery } from '@app/common/components/mscr-search/mscr-search.slice';
import useUrlState, {
  initialUrlState,
} from '@app/common/utils/hooks/use-url-state';
import { IconClose } from 'suomifi-icons';
import { useContext } from 'react';
import { SearchContext } from '@app/common/components/search-context-provider';
import SearchFilterSet from '@app/common/components/search-filter-set';
import { Bucket, Facet, Filter } from '@app/common/interfaces/search.interface';
import { useTranslation } from 'next-i18next';
import { Grid } from '@mui/material';

export default function SearchScreen() {
  const { urlState, patchUrlState } = useUrlState();
  const { t } = useTranslation('common');
  const { setIsSearchActive } = useContext(SearchContext);
  const { data: mscrSearchResults } = useGetMscrSearchResultsQuery(urlState);
  const foundHits = mscrSearchResults
    ? mscrSearchResults.hits.hits.length !== 0
    : false;

  const handleClose = () => {
    setIsSearchActive(false);
    patchUrlState({
      q: initialUrlState.q,
      type: initialUrlState.type,
      page: initialUrlState.page,
    });
  };

  // Constructing filters
  const facetTranslations = {
    state: t('search.facets.state'),
    type: t('search.facets.type'),
    format: t('search.facets.format'),
    organization: t('search.facets.organization'),
    isReferenced: t('search.facets.isReferenced')
  };

  const makeFilter = (key: string, buckets: Bucket[]): Filter => {
    const filterKey: Facet = key.substring(7) as Facet;
    const filterLabel = facetTranslations[filterKey];
    const options = buckets.map((bucket) => {
      return {
        // The keys work as labels for now, might change when we have organizations working
        label: bucket.key,
        key: bucket.key,
        count: bucket.doc_count,
      };
    });
    return {
      label: filterLabel,
      facet: filterKey,
      options: options,
    };
  };

  let filters: Filter[] = [];
  if (mscrSearchResults?.aggregations) {
    Object.keys(mscrSearchResults.aggregations).forEach((key) => {
      const newFilter: Filter = makeFilter(
        key,
        mscrSearchResults.aggregations[key].buckets
      );
      filters = filters.concat(newFilter);
    });
  }

  return (
    <SearchContainer>
      <Grid container justifyContent="space-between">
        <Grid item xs={2}>
          <FacetsWrapper>
            {/* Groups of facets for different contexts, made with search-filter-set */}
            {filters.length > 0 && (
              <SearchFilterSet title={t('in-all-mscr')} filters={filters} />
            )}
          </FacetsWrapper>
        </Grid>
        <Grid item xs={8}>
          <ResultsWrapper>
            {/* Only a list of results if searching all of mscr, but later can be two lists if searching own workspace */}
            {mscrSearchResults?.hits.hits.map((hit) => (
              <SearchResult key={hit._id} hit={hit} />
            ))}
            {!foundHits && <p>{t('search.no-match')}</p>}
          </ResultsWrapper>
        </Grid>
        <Grid item xs={1}>
          <CloseButton onClick={handleClose}>
            <IconClose />
          </CloseButton>
        </Grid>
      </Grid>
    </SearchContainer>
  );
}
