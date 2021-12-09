import { useSelector } from 'react-redux';
import {
  selectFilter,
  useGetGroupsQuery,
  useGetSearchResultQuery,
  resetFilter,
  SearchState,
  setFilter,
  useGetOrganizationsQuery
} from '../../common/components/terminology-search/terminology-search-slice';
import Title from '../../common/components/title/title';
import { ResultAndFilterContainer, ResultAndStatsWrapper } from './terminology-search.styles';
import SearchResults from '../../common/components/search-results/search-results';
import Filter from '../../common/components/filter/filter';

export default function TerminologySearch() {
  const filter = useSelector(selectFilter());
  const { data } = useGetSearchResultQuery(filter.keyword);
  const { data: groups } = useGetGroupsQuery(null);
  const { data: organizations } = useGetOrganizationsQuery(null);

  return (
    <>
      <Title info={'test'} />
      <ResultAndFilterContainer>
        <ResultAndStatsWrapper>
          <SearchResults
            data={data}
            filter={filter}
            setSomeFilter={setFilter}
            type={'terminology-search'}
          />
        </ResultAndStatsWrapper>
        <Filter
          filter={filter as SearchState['filter']}
          groups={groups}
          organizations={organizations}
          type={'terminology-search'}
          setSomeFilter={setFilter}
          resetSomeFilter={resetFilter}
        />
      </ResultAndFilterContainer>
    </>
  );
};
