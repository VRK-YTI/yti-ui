import { useSelector } from 'react-redux';
import {
  selectFilter,
  useGetGroupsQuery,
  useGetSearchResultQuery,
  resetFilter,
  SearchState,
  setFilter,
  useGetOrganizationsQuery,
  selectResultStart,
  setResultStart,
} from '../../common/components/terminology-search/terminology-search-slice';
import Title from '../../common/components/title/title';
import { ResultAndFilterContainer, ResultAndStatsWrapper, PaginationWrapper } from './terminology-search.styles';
import SearchResults from '../../common/components/search-results/search-results';
import Filter from '../../common/components/filter/filter';
import Pagination from '../../common/components/pagination/pagination';
import { useStoreDispatch } from '../../store';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useBreakpoints } from '../../common/components/media-query/media-query-context';

export default function TerminologySearch() {
  const { t } = useTranslation();
  const dispatch = useStoreDispatch();
  const query = useRouter();
  const filter = useSelector(selectFilter());
  const resultStart = useSelector(selectResultStart());
  const { data } = useGetSearchResultQuery({ filter: filter, resultStart: resultStart });
  const { data: groups } = useGetGroupsQuery(null);
  const { data: organizations } = useGetOrganizationsQuery(null);
  const breakPoints = useBreakpoints();

  if (query.query.page && query.query.page !== '1') {
    dispatch(setResultStart((parseInt(query.query.page as string, 10) - 1) * 10));
  } else {
    dispatch(setResultStart(0));
  }

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
          {
            (data && data !== null)
              ?
              <PaginationWrapper>
                <Pagination
                  data={data}
                  dispatch={dispatch}
                  isSmall={breakPoints.isSmall}
                  pageString={t('pagination-page')}
                  setResultStart={setResultStart}
                  query={query}
                />
              </PaginationWrapper>
              :
              <></>
          }
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
