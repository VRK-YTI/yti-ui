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
import { ResultAndFilterContainer, ResultAndStatsWrapper, PaginationWrapper, FilterMobileButton } from './terminology-search.styles';
import SearchResults from '../../common/components/search-results/search-results';
import Filter from '../../common/components/filter/filter';
import Pagination from '../../common/components/pagination/pagination';
import { useStoreDispatch } from '../../store';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useBreakpoints } from '../../common/components/media-query/media-query-context';
import { Modal, ModalContent } from 'suomifi-ui-components';
import { useState } from 'react';
import useQueryParam from '../../common/utils/hooks/useQueryParam';
import { useGetCountsQuery } from '../../common/components/counts/counts-slice';
import { Alert, Alerts } from '../../common/components/alert/';

/**
 * Error handling:
 * - if search results or any data needed for filter is still loading
 *   there should be a indicator that the component is waiting
 *   for updated data
 * - errors could be logged in console
 * - could some things be also wrapped in <ErrorBoundary> to display
 *   a message for user
 */

export default function TerminologySearch() {
  const { t, i18n } = useTranslation();
  const { isSmall } = useBreakpoints();
  const dispatch = useStoreDispatch();
  const query = useRouter();
  const filter = useSelector(selectFilter());
  const resultStart = useSelector(selectResultStart());
  const [keyword] = useQueryParam('q');
  const { data, error } = useGetSearchResultQuery({ filter: filter, resultStart: resultStart, keyword: keyword ?? '' });
  const { data: groups, error: groupsError } = useGetGroupsQuery(i18n.language);
  const { data: organizations, error: organizationsError } = useGetOrganizationsQuery(i18n.language);
  const { data: counts, error: countsError } = useGetCountsQuery(null);
  const [showModal, setShowModal] = useState(false);

  if (query.query.page && query.query.page !== '1') {
    dispatch(setResultStart((parseInt(query.query.page as string, 10) - 1) * 10));
  } else {
    dispatch(setResultStart(0));
  }

  const handleFilterChange = (value: any) => {
    if (query.query.page && query.query.page !== '1') {
      query.push(query.pathname + '?page=1');
    }
    return setFilter(value);
  };

  return (
    <>
      <Title info={t('terminology-title')} />
      {(isSmall && groups && organizations) &&
        <FilterMobileButton
          variant='secondary'
          fullWidth
          onClick={() => setShowModal(!showModal)}
        >
          {t('vocabulary-filter-filter-list')}
        </FilterMobileButton>
      }
      <ResultAndFilterContainer>
        <ResultAndStatsWrapper>
          {data &&
            <>
              <SearchResults
                data={data}
                filter={filter}
                setSomeFilter={handleFilterChange}
                type={'terminology-search'}
              />
              <PaginationWrapper>
                <Pagination
                  data={data}
                  dispatch={dispatch}
                  pageString={t('pagination-page')}
                  setResultStart={setResultStart}
                  query={query}
                />
              </PaginationWrapper>
            </>
          }
        </ResultAndStatsWrapper>
        {!isSmall
          ?
          <Filter
            filter={filter as SearchState['filter']}
            groups={groups}
            organizations={organizations}
            type={'terminology-search'}
            setSomeFilter={handleFilterChange}
            resetSomeFilter={resetFilter}
            counts={counts}
          />
          :
          <Modal
            appElementId='__next'
            visible={showModal}
            onEscKeyDown={() => setShowModal(false)}
            variant='smallScreen'
            style={{ border: 'none' }}
          >
            <ModalContent
              style={{ padding: '0' }}
            >
              <Filter
                filter={filter as SearchState['filter']}
                groups={groups}
                organizations={organizations}
                type={'terminology-search'}
                setSomeFilter={handleFilterChange}
                resetSomeFilter={resetFilter}
                isModal={true}
                setShowModal={setShowModal}
                resultCount={data?.totalHitCount}
                counts={counts}
              />
            </ModalContent>
          </Modal>
        }
      </ResultAndFilterContainer>
      <Alerts>
        {error && <Alert msg={'error-with-terminologies'} type='error' />}
        {groupsError && <Alert msg={'error-with-groups'} type='error' />}
        {organizationsError && <Alert msg={'error-with-organizations'} type='error' />}
        {countsError && <Alert msg={'error-with-counts'} type='error' />}
      </Alerts>
    </>
  );
};
