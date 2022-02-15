import { useEffect, useState } from 'react';
import {
  initializeVocabularyFilter,
  resetVocabularyFilter,
  setVocabularyFilter,
  useGetCollectionsQuery,
  useGetConceptResultQuery,
  useGetVocabularyQuery,
  VocabularyState,
  setCurrentTerminology
} from '../../common/components/vocabulary/vocabulary-slice';
import Filter from '../../common/components/filter/filter';
import SearchResults from '../../common/components/search-results/search-results';
import Title from '../../common/components/title/title';
import { ResultAndFilterContainer, ResultAndStatsWrapper } from './vocabulary.styles';
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
import { setAlert } from '../../common/components/alert/alert.slice';
import { Error } from '../../common/interfaces/error.interface';
import { useRouter } from 'next/router';
import LoadIndicator from '../../common/components/load-indicator';

/**
 * Error handling:
 * - if concept, collections or terminology info is still loading
 *   there should be a indicator that the component is waiting
 *   for updated data
 */

interface VocabularyProps {
  id: string;
}

export default function Vocabulary({ id }: VocabularyProps) {
  const { t, i18n } = useTranslation('common');
  const { isSmall } = useBreakpoints();
  const router = useRouter();
  const dispatch = useStoreDispatch();
  const filter: VocabularyState['filter'] = useSelector(selectVocabularyFilter());
  const {
    data: collections,
    error: collectionsError,
    isFetching: isFetchingCollections
  } = useGetCollectionsQuery(id);
  const {
    data: concepts,
    error: conceptsError,
    isFetching: isFetchingConcepts
  } = useGetConceptResultQuery(id);
  const { data: info, error: infoError } = useGetVocabularyQuery(id);
  const { data: counts, error: countsError } = useGetVocabularyCountQuery(id);
  const [showModal, setShowModal] = useState(false);

  if (infoError && 'status' in infoError && infoError?.status === 404) {
    router.push('/404');
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


  useEffect(() => {
    dispatch(setAlert([
      collectionsError as Error,
      conceptsError as Error,
      infoError as Error,
      countsError as Error
    ]));
  }, [dispatch, collectionsError, conceptsError, infoError, countsError]);

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
        <ResultAndStatsWrapper>
          {
            (filter.showBy === 'concepts' && isFetchingCollections)
            ||
            (filter.showBy === 'collections' && isFetchingConcepts)
            &&
            <LoadIndicator />
          }

          {(concepts && filter.showBy === 'concepts') &&
            <SearchResults
              data={concepts}
              filter={filter}
              setSomeFilter={setVocabularyFilter}
            />
          }
          {(collections && filter.showBy === 'collections') &&
            <SearchResults
              data={collections}
              filter={filter}
              setSomeFilter={setVocabularyFilter}
              type='collections'
            />
          }
        </ResultAndStatsWrapper>
        {
          (!collectionsError && !conceptsError)
            &&
            !isSmall
            ?
            <Filter
              filter={filter as VocabularyState['filter']}
              type={'vocabulary'}
              setSomeFilter={setVocabularyFilter}
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
                  setSomeFilter={setVocabularyFilter}
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
