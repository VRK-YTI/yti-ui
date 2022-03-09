import {
  useGetGroupsQuery,
  useGetSearchResultQuery,
  useGetOrganizationsQuery,
} from '../../common/components/terminology-search/terminology-search-slice';
import Title from '../../common/components/title/title';
import {
  ResultAndFilterContainer,
  ResultAndStatsWrapper,
  PaginationWrapper,
  FilterMobileButton
} from './terminology-search.styles';
import SearchResults from '../../common/components/search-results/search-results';
import Pagination from '../../common/components/pagination/pagination';
import { useTranslation } from 'next-i18next';
import { useBreakpoints } from '../../common/components/media-query/media-query-context';
import { Modal, ModalContent } from 'suomifi-ui-components';
import { useEffect, useState } from 'react';
import { useGetCountsQuery } from '../../common/components/counts/counts-slice';
import { SearchPageFilter } from './search-page-filter';
import useUrlState from '../../common/utils/hooks/useUrlState';
import { selectAlert, setAlert } from '../../common/components/alert/alert.slice';
import { Error } from '../../common/interfaces/error.interface';
import LoadIndicator from '../../common/components/load-indicator';
import { useStoreDispatch } from '../../store';
import { useSelector } from 'react-redux';

export default function TerminologySearch() {
  const { t, i18n } = useTranslation();
  const { isSmall } = useBreakpoints();
  const { urlState } = useUrlState();
  const { data, error, isFetching, refetch } = useGetSearchResultQuery({ urlState });
  const { data: groups, error: groupsError } = useGetGroupsQuery(i18n.language);
  const { data: organizations, error: organizationsError } = useGetOrganizationsQuery(i18n.language);
  const { data: counts, error: countsError } = useGetCountsQuery(null);
  const dispatch = useStoreDispatch();
  const [showModal, setShowModal] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const previousAlerts = useSelector(selectAlert());

  useEffect(() => {
    dispatch(setAlert([
      ...previousAlerts,
      error as Error,
      groupsError as Error,
      organizationsError as Error,
      countsError as Error
    ]));
  }, [dispatch, previousAlerts, error, groupsError, organizationsError, countsError]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(isFetching);
    }, 1000);
    return () => clearTimeout(timer);
  }, [isFetching, setShowLoading]);

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
        {!isSmall
          ?
          <SearchPageFilter
            organizations={organizations}
            groups={groups}
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
            <ModalContent style={{ padding: '0' }}>
              <SearchPageFilter
                isModal
                onModalClose={() => setShowModal(false)}
                resultCount={data?.totalHitCount}
                organizations={organizations}
                groups={groups}
                counts={counts}
              />
            </ModalContent>
          </Modal>
        }
        <ResultAndStatsWrapper id="search-results">
          {(showLoading && isFetching) || error
            ?
            <LoadIndicator isFetching={isFetching} error={error} refetch={refetch} />
            :
            data &&
            <>
              <SearchResults
                data={data}
                type="terminology-search"
                organizations={organizations}
                domains={groups}
              />
              <PaginationWrapper>
                <Pagination
                  data={data}
                  pageString={t('pagination-page')}
                />
              </PaginationWrapper>
            </>

          }
        </ResultAndStatsWrapper>
      </ResultAndFilterContainer>
    </>
  );
};
