import {
  FacetsWrapper,
  ResultsWrapper,
  SearchContainer,
  CloseButton,
} from '@app/modules/search/search-screen/search-screen.styles';
import SearchResult from 'src/modules/search/search-result';
import { useGetMscrSearchResultsQuery } from '@app/common/components/mscr-search/mscr-search.slice';
import useUrlState, {
  initialUrlState,
} from '@app/common/utils/hooks/use-url-state';
import { IconClose } from 'suomifi-icons';
import { useContext, useEffect, useState } from 'react';
import { SearchContext } from '@app/common/components/search-context-provider';
import SearchFilterSet from 'src/modules/search/search-filter-set';
import { useTranslation } from 'next-i18next';
import { Grid } from '@mui/material';
import { useRouter } from 'next/router';

export default function SearchScreen() {
  const { urlState, patchUrlState } = useUrlState();
  const { t } = useTranslation('common');
  const { setIsSearchActive } = useContext(SearchContext);
  const { data: mscrSearchResults } = useGetMscrSearchResultsQuery(urlState);
  const { query, pathname } = useRouter();
  const [currentPath] = useState(pathname);

  const handleClose = () => {
    setIsSearchActive(false);
    patchUrlState({
      q: initialUrlState.q,
      type: initialUrlState.type,
      state: initialUrlState.state,
      format: initialUrlState.format,
      organization: initialUrlState.organization,
      isReferenced: initialUrlState.isReferenced,
      page: initialUrlState.page,
    });
  };

  // if (!mscrSearchResults) {
  //   // TODO: Some kind of error message?
  // }

  const foundHits = mscrSearchResults
    ? mscrSearchResults.hits.hits.length !== 0
    : false;

  return (
    <SearchContainer>
      <Grid container justifyContent="space-between">
        <Grid item xs={2}>
          <FacetsWrapper>
            {/* Groups of facets for different contexts, made with search-filter-set */}
            <SearchFilterSet
              title={t('search.facets.filter-by')}
              aggregations={mscrSearchResults?.aggregations}
            />
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
