import { useEffect, useState } from 'react';
import {
  initializeVocabularyFilter,
  resetVocabularyFilter,
  setVocabularyFilter,
  useGetCollectionsQuery,
  useGetConceptResultQuery,
  useGetVocabularyQuery,
  VocabularyState,
  setCurrentTerminology,
  setResultStart,
  selectResultStart
} from '../../common/components/vocabulary/vocabulary-slice';
import Filter from '../../common/components/filter/filter';
import SearchResults from '../../common/components/search-results/search-results';
import Title from '../../common/components/title/title';
import { ResultAndFilterContainer, ResultAndStatsWrapper, PaginationWrapper } from './vocabulary.styles';
import { selectVocabularyFilter } from '../../common/components/vocabulary/vocabulary-slice';
import { useSelector } from 'react-redux';
import { useStoreDispatch } from '../../store';
import { useBreakpoints } from '../../common/components/media-query/media-query-context';
import { FilterMobileButton } from '../terminology-search/terminology-search.styles';
import { useTranslation } from 'next-i18next';
import { Modal, ModalContent } from 'suomifi-ui-components';
import { Breadcrumb, BreadcrumbLink } from '../../common/components/breadcrumb';
import PropertyValue from '../../common/components/property-value';
import { useGetVocabularyCountQuery } from '../../common/components/counts/counts-slice';
import { getPropertyValue } from '../../common/components/property-value/get-property-value';
import Pagination from '../../common/components/pagination/pagination';
import { useRouter } from 'next/router';
import useQueryParam from '../../common/utils/hooks/useQueryParam';
import filterData from '../../common/utils/filter-data';

interface VocabularyProps {
  id: string;
}

export default function Vocabulary({ id }: VocabularyProps) {
  const { t, i18n } = useTranslation('common');
  const { isSmall } = useBreakpoints();
  const query = useRouter();
  const dispatch = useStoreDispatch();
  const filter: VocabularyState['filter'] = useSelector(selectVocabularyFilter());
  const resultStart: number = useSelector(selectResultStart());
  const [keyword] = useQueryParam('q');
  const [page] = useQueryParam('page');
  const { data: collections } = useGetCollectionsQuery(id);
  const { data: concepts } = useGetConceptResultQuery({
    id: id,
    resultStart: resultStart,
    query: keyword ?? '',
    status: Object.keys(filter.status).filter(k => filter.status[k])
  });
  const { data: info } = useGetVocabularyQuery(id);
  const { data: counts } = useGetVocabularyCountQuery(id);
  const [showModal, setShowModal] = useState(false);

  if (query.query.page && query.query.page !== '1') {
    dispatch(setResultStart((parseInt(query.query.page as string, 10) - 1) * 10));
  } else {
    dispatch(setResultStart(0));
  }

  useEffect(() => {
    dispatch(initializeVocabularyFilter());
  }, [dispatch]);

  useEffect(() => {
    if (info) {
      dispatch(setCurrentTerminology({
        id: info?.id,
        value: getPropertyValue({
          property: info?.properties.prefLabel,
          language: i18n.language,
          fallbackLanguage: 'fi'
        }) ?? '',
      }));
    }
  }, [info, i18n, dispatch]);

  const handleFilterChange = (value: any) => {
    if (query.query.page && query.query.page !== '1') {
      const pathname = query.pathname.replace('[terminologyId]', id);
      query.push(pathname + '?page=1');
    }
    return setVocabularyFilter(value);
  };

  return (
    <>
      <Breadcrumb>
        <BreadcrumbLink url={`/terminology/${id}`} current>
          <PropertyValue property={info?.properties.prefLabel} />
        </BreadcrumbLink>
      </Breadcrumb>

      {info && <Title info={info} />}
      {isSmall &&
        <FilterMobileButton
          variant='secondary'
          fullWidth
          onClick={() => setShowModal(!showModal)}
        >
          {t('vocabulary-filter-filter-list')}
        </FilterMobileButton>
      }
      <ResultAndFilterContainer>
        {(concepts && filter.showBy === 'concepts') &&
          <ResultAndStatsWrapper>
            <SearchResults
              data={concepts}
              filter={filter}
              setSomeFilter={handleFilterChange}
            />
            <PaginationWrapper>
              <Pagination
                data={concepts}
                dispatch={dispatch}
                pageString={t('pagination-page')}
                setResultStart={setResultStart}
                query={query}
              />
            </PaginationWrapper>
          </ResultAndStatsWrapper>
        }
        {(collections && filter.showBy === 'collections') &&
          <ResultAndStatsWrapper>
            <SearchResults
              data={filterData(collections, filter, keyword ?? '', i18n.language, page) ?? collections}
              filter={filter}
              setSomeFilter={handleFilterChange}
              type='collections'
            />
            <PaginationWrapper>
              <Pagination
                data={filterData(collections, filter, keyword ?? '', i18n.language, page) ?? collections}
                dispatch={dispatch}
                pageString={t('pagination-page')}
                setResultStart={setResultStart}
                query={query}

              />
            </PaginationWrapper>
          </ResultAndStatsWrapper>
        }
        {!isSmall
          ?
          <Filter
            filter={filter as VocabularyState['filter']}
            type={'vocabulary'}
            setSomeFilter={handleFilterChange}
            resetSomeFilter={resetVocabularyFilter}
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
                filter={filter as VocabularyState['filter']}
                type={'vocabulary'}
                setSomeFilter={handleFilterChange}
                resetSomeFilter={resetVocabularyFilter}
                isModal={true}
                setShowModal={setShowModal}
                resultCount={concepts?.totalHitCount}
                counts={counts}
              />
            </ModalContent>
          </Modal>
        }
      </ResultAndFilterContainer>
    </>
  );
};
