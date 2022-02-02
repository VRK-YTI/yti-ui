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

/**
 * Error handling:
 * - if an error occurs in data fetching there should be
 *   an alert indicating that a problem occured
 * - if vocabulary with an id does not exist user should
 *   be redirected to 404 page
 * - if (any) data fails to be fetched the styling
 *   of the page shouldn't change
 * -
 *
 */

interface VocabularyProps {
  id: string;
}

export default function Vocabulary({ id }: VocabularyProps) {
  const { t, i18n } = useTranslation('common');
  const { isSmall } = useBreakpoints();
  const dispatch = useStoreDispatch();
  const filter: VocabularyState['filter'] = useSelector(selectVocabularyFilter());
  const { data: collections } = useGetCollectionsQuery(id);
  const { data: concepts } = useGetConceptResultQuery(id);
  const { data: info } = useGetVocabularyQuery(id);
  const { data: counts } = useGetVocabularyCountQuery(id);
  const [showModal, setShowModal] = useState(false);

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
              setSomeFilter={setVocabularyFilter}
            />
          </ResultAndStatsWrapper>
        }
        {(collections && filter.showBy === 'collections') &&
          <ResultAndStatsWrapper>
            <SearchResults
              data={collections}
              filter={filter}
              setSomeFilter={setVocabularyFilter}
              type='collections'
            />
          </ResultAndStatsWrapper>
        }
        {!isSmall
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
