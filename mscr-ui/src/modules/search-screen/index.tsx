import {FacetsWrapper, ResultsWrapper, SearchContainer} from '@app/modules/search-screen/search-screen.styles';
import SearchResult from '@app/common/components/search-result';
import {useGetMscrSearchResultsQuery} from '@app/common/components/mscr-search/mscr-search.slice';
import useUrlState, { UrlState } from '@app/common/utils/hooks/use-url-state';

export default function SearchScreen() {
  const { urlState, patchUrlState } = useUrlState();

  const { data: mscrSearchResults, refetch: refetchMscrSearchResults } =
    useGetMscrSearchResultsQuery(urlState);

  console.log('search results: ', mscrSearchResults);  // Prints in the browser
  console.log('screen uses urlstate: ', urlState);
  return (
    <SearchContainer>
      <p>Search screen is now open</p>
      <FacetsWrapper>
        {/* Groups of facets for different contexts, made with search-filter-set */}
      </FacetsWrapper>
      <ResultsWrapper>
        {/* Only a list of results if searching all of mscr, but two lists if searching own workspace */}
        {mscrSearchResults?.hits.hits.map((hit) => (
          <SearchResult key={hit._id} id={hit._id} />
        ))}
      </ResultsWrapper>
      {/* Close button */}
    </SearchContainer>
  );
}
