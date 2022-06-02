import { useEffect, useState } from 'react';
import {
  useGetCollectionsQuery,
  useGetConceptResultQuery,
  useGetVocabularyQuery,
} from '@app/common/components/vocabulary/vocabulary.slice';
import SearchResults from '@app/common/components/search-results/search-results';
import Title from '@app/common/components/title/title';
import {
  ResultAndFilterContainer,
  ResultAndStatsWrapper,
  PaginationWrapper,
} from './vocabulary.styles';
import { useBreakpoints } from '@app/common/components/media-query/media-query-context';
import { FilterMobileButton } from '@app/modules/terminology-search/terminology-search.styles';
import { useTranslation } from 'next-i18next';
import { Modal, ModalContent } from 'suomifi-ui-components';
import { Breadcrumb, BreadcrumbLink } from '@app/common/components/breadcrumb';
import PropertyValue from '@app/common/components/property-value';
import { useGetVocabularyCountQuery } from '@app/common/components/counts/counts.slice';
import { TerminologyListFilter } from './terminology-list-filter';
import useUrlState from '@app/common/utils/hooks/useUrlState';
import Pagination from '@app/common/components/pagination/pagination';
import filterData from '@app/common/utils/filter-data';
import { setAlert } from '@app/common/components/alert/alert.slice';
import { useRouter } from 'next/router';
import LoadIndicator from '@app/common/components/load-indicator';
import { useStoreDispatch } from '@app/store';
import { getPropertyValue } from '@app/common/components/property-value/get-property-value';

interface VocabularyProps {
  id: string;
  setTerminologyTitle: (title?: string) => void;
}

export default function Vocabulary({
  id,
  setTerminologyTitle,
}: VocabularyProps) {
  const { t, i18n } = useTranslation('common');
  const { isSmall } = useBreakpoints();
  const { urlState } = useUrlState();
  const router = useRouter();
  const dispatch = useStoreDispatch();
  const {
    data: collections,
    error: collectionsError,
    isFetching: isFetchingCollections,
    refetch: refetchCollections,
  } = useGetCollectionsQuery(id);
  const {
    data: concepts,
    error: conceptsError,
    isFetching: isFetchingConcepts,
    refetch: refetchConcepts,
  } = useGetConceptResultQuery({ id, urlState, lang: i18n.language });
  const { data: info, error: infoError } = useGetVocabularyQuery(id);
  const { data: counts, error: countsError } = useGetVocabularyCountQuery(id);
  const [showModal, setShowModal] = useState(false);
  const [showLoadingConcepts, setShowLoadingConcepts] = useState(false);
  const [showLoadingCollections, setShowLoadingCollections] = useState(false);

  if (infoError && 'status' in infoError && infoError?.status === 404) {
    router.push('/404');
  }

  const prefLabel = getPropertyValue({
    property: info?.properties.prefLabel,
    language: i18n.language,
    fallbackLanguage: 'fi',
  });
  useEffect(() => {
    setTerminologyTitle(prefLabel);
  }, [setTerminologyTitle, prefLabel]);

  useEffect(() => {
    dispatch(
      setAlert([collectionsError, conceptsError, infoError, countsError], [])
    );
  }, [dispatch, collectionsError, conceptsError, infoError, countsError]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoadingCollections(isFetchingCollections);
      setShowLoadingConcepts(isFetchingConcepts);
    }, 1000);
    return () => clearTimeout(timer);
  }, [
    isFetchingConcepts,
    isFetchingCollections,
    setShowLoadingConcepts,
    setShowLoadingCollections,
  ]);

  return (
    <>
      <Breadcrumb>
        {!infoError && (
          <BreadcrumbLink url={`/terminology/${id}`} current>
            <PropertyValue
              property={info?.properties.prefLabel}
              fallbackLanguage="fi"
            />
          </BreadcrumbLink>
        )}
      </Breadcrumb>

      <main id="main">
        {info && <Title info={info} />}
        {isSmall && (
          <FilterMobileButton
            variant="secondary"
            fullWidth
            onClick={() => setShowModal(!showModal)}
          >
            {t('vocabulary-filter-filter-list')}
          </FilterMobileButton>
        )}
        <ResultAndFilterContainer>
          {!isSmall ? (
            <TerminologyListFilter counts={counts} />
          ) : (
            <Modal
              appElementId="__next"
              visible={showModal}
              onEscKeyDown={() => setShowModal(false)}
              variant="smallScreen"
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
          )}
          <ResultAndStatsWrapper id="search-results">
            {urlState.type === 'concept' &&
              ((showLoadingConcepts && isFetchingConcepts) || conceptsError ? (
                <LoadIndicator
                  isFetching={isFetchingConcepts}
                  error={conceptsError}
                  refetch={refetchConcepts}
                />
              ) : (
                concepts && (
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
              ))}
            {urlState.type === 'collection' && renderCollection()}
          </ResultAndStatsWrapper>
        </ResultAndFilterContainer>
      </main>
    </>
  );

  function renderCollection() {
    if ((showLoadingCollections && isFetchingCollections) || collectionsError) {
      return (
        <LoadIndicator
          isFetching={isFetchingCollections}
          error={collectionsError}
          refetch={refetchCollections}
        />
      );
    }

    if (collections) {
      return (
        <>
          <SearchResults
            data={
              filterData(collections, urlState, i18n.language) ?? collections
            }
            type="collections"
          />
          <PaginationWrapper>
            <Pagination
              data={
                filterData(collections, urlState, i18n.language) ?? collections
              }
              pageString={t('pagination-page')}
            />
          </PaginationWrapper>
        </>
      );
    }
  }
}
