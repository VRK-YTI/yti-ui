import { useEffect, useMemo, useState } from 'react';
import {
  useGetCollectionsQuery,
  useGetConceptResultQuery,
  useGetVocabularyQuery,
} from '@app/common/components/vocabulary/vocabulary.slice';
import {
  default as SearchResults,
  SearchResultData,
} from 'yti-common-ui/search-results/search-results';
import Title from 'yti-common-ui/title';
import {
  ResultAndFilterContainer,
  ResultAndStatsWrapper,
  QuickActionsWrapper,
} from './vocabulary.styles';
import { useBreakpoints } from 'yti-common-ui/media-query';
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
import { Breadcrumb, BreadcrumbLink } from 'yti-common-ui/breadcrumb';
import PropertyValue from '@app/common/components/property-value';
import { useGetVocabularyCountQuery } from '@app/common/components/counts/counts.slice';
import { TerminologyListFilter } from './terminology-list-filter';
import useUrlState from '@app/common/utils/hooks/use-url-state';
import Pagination from 'yti-common-ui/pagination';
import LoadIndicator from 'yti-common-ui/load-indicator';
import { useRouter } from 'next/router';
import HasPermission from '@app/common/utils/has-permission';
import dynamic from 'next/dynamic';
import ConceptImportModal from '@app/common/components/concept-import';
import getPrefLabel from '@app/common/utils/get-preflabel';
import { getPropertyValue } from '@app/common/components/property-value/get-property-value';
import { Property } from '@app/common/interfaces/termed-data-types.interface';
import {
  TitleType,
  TitleTypeAndStatusWrapper,
} from 'yti-common-ui/title/title.styles';
import {
  translateStatus,
  translateTerminologyType,
} from '@app/common/utils/translation-helpers';
import InfoExpander from '@app/common/components/info-dropdown/info-expander';
import { useStoreDispatch } from '@app/store';
import { setTitle } from '@app/common/components/title/title.slice';
import { StatusChip } from 'yti-common-ui/status-chip';

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
  const dispatch = useStoreDispatch();
  const {
    data: collectionsData,
    error: collectionsError,
    isFetching: isFetchingCollections,
    isUninitialized: isUninitializedCollections,
    refetch: refetchCollections,
  } = useGetCollectionsQuery(id, { skip: urlState.type !== 'collection' });
  const {
    data: conceptsData,
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

  const concepts: SearchResultData[] = useMemo(() => {
    if (!conceptsData) {
      return [];
    }

    return conceptsData.concepts.map((concept) => ({
      id: concept.id,
      description:
        getPrefLabel({
          prefLabels: concept.definition,
          lang: urlState.lang !== '' ? urlState.lang : i18n.language,
        }) ?? '',
      status: concept.status,
      title: getPrefLabel({
        prefLabels: concept.label,
        lang: urlState.lang !== '' ? urlState.lang : i18n.language,
      }),
      titleLink: `${id}/concept/${concept.id}`,
      type: t('vocabulary-info-concept'),
    }));
  }, [conceptsData, t, i18n.language, id, urlState.lang]);

  const collections: SearchResultData[] = useMemo(() => {
    if (!collectionsData) {
      return [];
    }

    return collectionsData.map((collection) => ({
      id: collection.id,
      description: getPropertyValue({
        property: collection.properties.definition,
        language: urlState.lang !== '' ? urlState.lang : i18n.language,
      }),
      title: getPropertyValue({
        property: collection.properties.prefLabel,
        language: urlState.lang !== '' ? urlState.lang : i18n.language,
      }),
      titleLink: `${id}/collection/${collection.id}`,
      type: t('vocabulary-info-collection'),
    }));
  }, [collectionsData, t, id, urlState.lang, i18n.language]);

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

  useEffect(() => {
    dispatch(
      setTitle(
        getPropertyValue({
          property: info?.properties.prefLabel,
          language: i18n.language,
        })
      )
    );
  }, [dispatch, info?.properties.prefLabel, i18n.language]);

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
        <Title
          title={getPropertyValue({
            property: info?.properties.prefLabel,
            language: i18n.language,
          })}
          extra={
            <>
              <TitleTypeAndStatusWrapper>
                <TitleType>
                  {translateTerminologyType(
                    info?.properties.terminologyType?.[0].value ??
                      'TERMINOLOGICAL_VOCABULARY',
                    t
                  )}
                </TitleType>{' '}
                &middot;
                <StatusChip
                  status={info?.properties.status?.[0].value ?? 'DRAFT'}
                  id="status-chip"
                >
                  {translateStatus(
                    info?.properties.status?.[0].value ?? 'DRAFT',
                    t
                  )}
                </StatusChip>
              </TitleTypeAndStatusWrapper>
              <InfoExpander data={info} />
            </>
          }
        />
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
                  resultCount={conceptsData?.totalHitCount}
                  counts={counts}
                  languages={info?.properties.language}
                />
              </ModalContent>
            </Modal>
          )}
          <ResultAndStatsWrapper id="search-results">
            <QuickActionsWrapper $isSmall={isSmall}>
              <Heading variant="h2" id="results-title">
                {urlState.type === 'concept'
                  ? t('vocabulary-concepts')
                  : t('vocabulary-collections')}
              </Heading>
              {HasPermission({
                actions: 'CREATE_CONCEPT',
                targetOrganization: info?.references.contributor,
              }) && (
                <>
                  <NewConceptModal
                    terminologyId={id}
                    languages={
                      info?.properties.language?.map(({ value }) => value) ?? []
                    }
                  />
                  <ConceptImportModal
                    refetch={refetchConcepts}
                    terminologyId={id}
                  />
                </>
              )}
            </QuickActionsWrapper>

            {isSmall && (
              <FilterMobileButton
                variant="secondary"
                fullWidth
                onClick={() => setShowModal(!showModal)}
              >
                {t('filter-list')}
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
                conceptsData && (
                  <>
                    <SearchResults
                      noDescriptionText={t('terminology-search-no-definition')}
                      tagsHiddenTitle=""
                      tagsTitle={t('vocabulary-results-concepts', {
                        count: conceptsData.totalHitCount,
                      })}
                      data={concepts}
                      domains={[]}
                      organizations={[]}
                      noChip
                      noVersion
                    />
                    <Pagination
                      maxPages={Math.ceil(conceptsData.totalHitCount / 50)}
                    />
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

    if (collectionsData) {
      const collectionMembers: { [key: string]: string }[] =
        collectionsData.map((collection) => {
          const memberLabels =
            collection.references.member?.map((m) => {
              const labels: Property[] =
                m.references.prefLabelXl
                  ?.flatMap((label) => label.properties.prefLabel ?? [])
                  .filter((val) => val) ?? [];

              if (labels) {
                return Object.assign(
                  {},
                  labels.reduce(
                    (obj, item) => ({
                      ...obj,
                      [item.lang]: urlState.q
                        ? item.value.replaceAll(
                            urlState.q,
                            `<b>${urlState.q}</b>`
                          )
                        : item.value,
                    }),
                    {}
                  )
                );
              }

              return [];
            }) ?? [];

          const membersWithCorrectLabels = memberLabels.map((label) =>
            getPrefLabel({
              prefLabels: label,
              lang: urlState.lang !== '' ? urlState.lang : i18n.language,
            })
          );

          if (urlState.q !== '') {
            const matchingMembers = membersWithCorrectLabels
              .filter((value) => value.includes(urlState.q))
              .slice(0, 5);

            if (
              matchingMembers.length > 0 &&
              matchingMembers.length !== membersWithCorrectLabels.length
            ) {
              const diff =
                membersWithCorrectLabels.length - matchingMembers.length;
              return {
                [collection.id]: `${matchingMembers.join(', ')} + ${diff} ${t(
                  'vocabulary-results-more'
                )}`,
              };
            }

            return { [collection.id]: matchingMembers.join(', ') };
          }

          return {
            [collection.id]: membersWithCorrectLabels.slice(0, 5).join(', '),
          };
        });

      const collectionsExtra = Object.assign({}, ...collectionMembers);

      const filteredCollections =
        urlState.q !== ''
          ? collections.filter((collection) => {
              if (
                collection.title.includes(urlState.q) ||
                collectionsExtra[collection.id] ||
                collectionsExtra[collection.id] !== ''
              ) {
                return true;
              }
              return false;
            })
          : collections;

      return (
        <>
          <SearchResults
            noDescriptionText={t('terminology-search-no-definition')}
            tagsHiddenTitle=""
            tagsTitle={t('vocabulary-results-collections', {
              count: filteredCollections.length,
            })}
            data={filteredCollections}
            domains={[]}
            organizations={[]}
            noVersion
            extra={{
              other: {
                title: t('vocabulary-filter-concepts'),
                items: collectionsExtra,
              },
            }}
          />
          <Pagination maxPages={filteredCollections.length / 50} />
        </>
      );
    }
  }
}
