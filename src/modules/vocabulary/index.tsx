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
  QuickActionsWrapper,
} from './vocabulary.styles';
import { useBreakpoints } from '@app/common/components/media-query/media-query-context';
import { FilterMobileButton } from '@app/modules/terminology-search/terminology-search.styles';
import { useTranslation } from 'next-i18next';
import {
  Heading,
  Modal,
  ModalContent,
  Notification,
  Paragraph,
  Text,
} from 'suomifi-ui-components';
import { Breadcrumb, BreadcrumbLink } from '@app/common/components/breadcrumb';
import PropertyValue from '@app/common/components/property-value';
import { useGetVocabularyCountQuery } from '@app/common/components/counts/counts.slice';
import { TerminologyListFilter } from './terminology-list-filter';
import useUrlState from '@app/common/utils/hooks/use-url-state';
import Pagination from '@app/common/components/pagination/pagination';
import filterData from '@app/common/utils/filter-data';
import LoadIndicator from '@app/common/components/load-indicator';
import { useRouter } from 'next/router';
import HasPermission from '@app/common/utils/has-permission';
import dynamic from 'next/dynamic';

const NewConceptModal = dynamic(
  () => import('@app/common/components/new-concept-modal')
);

interface VocabularyProps {
  id: string;
}

export default function Vocabulary({ id }: VocabularyProps) {
  const { t, i18n } = useTranslation('common');
  const { isSmall } = useBreakpoints();
  const { urlState } = useUrlState();
  const router = useRouter();
  const {
    data: collections,
    error: collectionsError,
    isFetching: isFetchingCollections,
    isUninitialized: isUninitializedCollections,
    refetch: refetchCollections,
  } = useGetCollectionsQuery(id, { skip: urlState.type !== 'collection' });
  const {
    data: concepts,
    error: conceptsError,
    isFetching: isFetchingConcepts,
    refetch: refetchConcepts,
  } = useGetConceptResultQuery({
    id,
    urlState,
    language: i18n.language,
  });
  const { data: info, error: infoError } = useGetVocabularyQuery({
    id,
  });
  const { data: counts } = useGetVocabularyCountQuery(id);
  const [showModal, setShowModal] = useState(false);
  const [showLoadingConcepts, setShowLoadingConcepts] = useState(false);
  const [showLoadingCollections, setShowLoadingCollections] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoadingCollections(
        isUninitializedCollections || isFetchingCollections
      );
      setShowLoadingConcepts(isFetchingConcepts);
    }, 1000);
    return () => clearTimeout(timer);
  }, [
    isFetchingConcepts,
    isFetchingCollections,
    isUninitializedCollections,
    setShowLoadingConcepts,
    setShowLoadingCollections,
  ]);

  if (infoError) {
    return (
      <>
        <Breadcrumb>
          <BreadcrumbLink url={''} current>
            ...
          </BreadcrumbLink>
        </Breadcrumb>

        <main id="main">
          <Notification
            closeText={t('close')}
            headingText={t('error-not-found', { context: 'terminology' })}
            status="error"
            onCloseButtonClick={() => router.push('/')}
          >
            <Paragraph>
              <Text smallScreen>
                {t('error-not-found-desc', { context: 'terminology' })}
              </Text>
            </Paragraph>
          </Notification>
        </main>
      </>
    );
  }

  return (
    <>
      <Breadcrumb>
        <BreadcrumbLink url={`/terminology/${id}`} current>
          <PropertyValue property={info?.properties.prefLabel} />
        </BreadcrumbLink>
      </Breadcrumb>

      <main id="main">
        {info && <Title info={info} />}
        <ResultAndFilterContainer>
          {!isSmall ? (
            <TerminologyListFilter
              counts={counts}
              languages={info?.properties.language}
            />
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
                  languages={info?.properties.language}
                />
              </ModalContent>
            </Modal>
          )}
          <ResultAndStatsWrapper id="search-results">
            <QuickActionsWrapper isSmall={isSmall}>
              <Heading variant="h2" id="results-title">
                {urlState.type === 'concept'
                  ? t('vocabulary-concepts')
                  : t('vocabulary-collections')}
              </Heading>
              {HasPermission({
                actions: 'CREATE_CONCEPT',
                targetOrganization: info?.references.contributor,
              }) && (
                <NewConceptModal
                  terminologyId={id}
                  languages={
                    info?.properties.language?.map(({ value }) => value) ?? []
                  }
                />
              )}
            </QuickActionsWrapper>

            {isSmall && (
              <FilterMobileButton
                variant="secondary"
                fullWidth
                onClick={() => setShowModal(!showModal)}
              >
                {t('vocabulary-filter-filter-list')}
              </FilterMobileButton>
            )}

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
                    <SearchResults data={concepts} type="concepts" />
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
