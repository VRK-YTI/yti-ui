import {FacetsWrapper, ResultsWrapper, SearchContainer} from '@app/modules/search-screen/search-screen.styles';
import SearchResult from '@app/common/components/search-result';
import {useGetMscrSearchResultsQuery} from '@app/common/components/mscr-search/mscr-search.slice';
import useUrlState, {initialUrlState, UrlState} from '@app/common/utils/hooks/use-url-state';
import {IconClose} from 'suomifi-icons';
import {useContext} from 'react';
import {SearchContext} from '@app/common/components/search-context-provider';

export default function SearchScreen() {
  const { urlState, patchUrlState } = useUrlState();
  const {isSearchActive, setIsSearchActive} = useContext(SearchContext);
  const { data: mscrSearchResults, refetch: refetchMscrSearchResults } =
    useGetMscrSearchResultsQuery(urlState);

  const handleClose = () => {
    setIsSearchActive(false);
    patchUrlState({
      q: initialUrlState.q,
      type: initialUrlState.type,
      page: initialUrlState.page,
    });
  };

  return (
    <SearchContainer>
      <p>Search screen is now open</p>
      <FacetsWrapper>
        {/* Groups of facets for different contexts, made with search-filter-set */}
      </FacetsWrapper>
      <ResultsWrapper>
        {/* Only a list of results if searching all of mscr, but two lists if searching own workspace */}
        {mscrSearchResults?.hits.hits.map((hit) => (
          <SearchResult key={hit._id} hit={hit} />
        ))}
      </ResultsWrapper>
      {/* Close button */}
      <button onClick={handleClose}>
        <IconClose />
      </button>
    </SearchContainer>
  );
}
