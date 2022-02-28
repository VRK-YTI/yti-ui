import { useEffect, useState } from 'react';
import {
  useGetCollectionsQuery,
  useGetConceptResultQuery,
  useGetVocabularyQuery,
} from '../../common/components/vocabulary/vocabulary-slice';
import SearchResults from '../../common/components/search-results/search-results';
import Title from '../../common/components/title/title';
import { ResultAndFilterContainer, ResultAndStatsWrapper, PaginationWrapper } from './vocabulary.styles';
import { useBreakpoints } from '../../common/components/media-query/media-query-context';
import { FilterMobileButton } from '../terminology-search/terminology-search.styles';
import { useTranslation } from 'next-i18next';
import { Modal, ModalContent } from 'suomifi-ui-components';
import { Breadcrumb, BreadcrumbLink } from '../../common/components/breadcrumb';
import PropertyValue from '../../common/components/property-value';
import { useGetVocabularyCountQuery } from '../../common/components/counts/counts-slice';
import { TerminologyListFilter } from './terminology-list-filter';
import useUrlState from '../../common/utils/hooks/useUrlState';
import Pagination from '../../common/components/pagination/pagination';
import filterData from '../../common/utils/filter-data';
import { setAlert } from '../../common/components/alert/alert.slice';
import { Error } from '../../common/interfaces/error.interface';
import { useRouter } from 'next/router';
import LoadIndicator from '../../common/components/load-indicator';
import { useStoreDispatch } from '../../store';

interface VocabularyProps {
  id: string;
}

export default function Vocabulary({ id }: VocabularyProps) {
  const { t, i18n } = useTranslation('common');
  const { isSmall } = useBreakpoints();
  const { urlState } = useUrlState();
  const router = useRouter();
  const dispatch = useStoreDispatch();
  const {
    data: collections,
    error: collectionsError,
    isFetching: isFetchingCollections,
    refetch: refetchCollections
  } = useGetCollectionsQuery(id);
  const {
    data: concepts,
    error: conceptsError,
    isFetching: isFetchingConcepts,
    refetch: refetchConcepts
  } = useGetConceptResultQuery({ id, urlState });
  const { data: info, error: infoError } = useGetVocabularyQuery(id);
  const { data: counts, error: countsError } = useGetVocabularyCountQuery(id);
  const [showModal, setShowModal] = useState(false);
  const [showLoadingConcepts, setShowLoadingConcepts] = useState(false);
  const [showLoadingCollections, setShowLoadingCollections] = useState(false);

  if (infoError && 'status' in infoError && infoError?.status === 404) {
    router.push('/404');
  }

  useEffect(() => {
    dispatch(setAlert([
      collectionsError as Error,
      conceptsError as Error,
      infoError as Error,
      countsError as Error
    ]));
  }, [dispatch, collectionsError, conceptsError, infoError, countsError]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoadingCollections(isFetchingCollections);
      setShowLoadingConcepts(isFetchingConcepts);
    }, 1000);
    return () => clearTimeout(timer);
  }, [isFetchingConcepts, isFetchingCollections, setShowLoadingConcepts, setShowLoadingCollections]);

  return (
    <>
      <Breadcrumb>
        {!infoError &&
          <BreadcrumbLink url={`/terminology/${id}`} current>
            <PropertyValue property={info?.properties.prefLabel} />
          </BreadcrumbLink>
        }
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
        <ResultAndStatsWrapper id="search-results">
          {urlState.type === 'concept' &&
            (
              ((showLoadingConcepts && isFetchingConcepts) || conceptsError)
                ?
                <LoadIndicator
                  isFetching={isFetchingConcepts}
                  error={conceptsError}
                  refetch={refetchConcepts}
                />
                :
                concepts &&
                <>
                  <SearchResults data={concepts} />
                  <PaginationWrapper>
                    <Pagination
                      data={concepts}
                      pageString={t('pagination-page')}
                    />
                  </PaginationWrapper>
                </>
            )
          }
          {urlState.type === 'collection' &&
            (
              ((showLoadingCollections && isFetchingCollections) || collectionsError)
                ?
                <LoadIndicator
                  isFetching={isFetchingCollections}
                  error={collectionsError}
                  refetch={refetchCollections}
                />
                :
                collections &&
                <>
                  <SearchResults
                    data={filterData(collections, urlState, i18n.language) ?? collections}
                    type="collections"
                  />
                  <PaginationWrapper>
                    <Pagination
                      data={filterData(collections, urlState, i18n.language) ?? collections}
                      pageString={t('pagination-page')}
                    />
                  </PaginationWrapper>
                </>
            )
          }
        </ResultAndStatsWrapper>
        {!isSmall
          ?
          <TerminologyListFilter counts={counts} />
          :
          <Modal
            appElementId='__next'
            visible={showModal}
            onEscKeyDown={() => setShowModal(false)}
            variant='smallScreen'
            style={{ border: 'none' }}
          >
            <ModalContent style={{ padding: '0' }}>
              <TerminologyListFilter
                isModal
                onModalClose={() => setShowModal(false)}
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
