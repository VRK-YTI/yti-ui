import { useEffect, useState } from 'react';
import { initializeVocabularyFilter, resetVocabularyFilter, setVocabularyFilter, useGetConceptResultQuery, useGetVocabularyQuery, VocabularyState } from '../../common/components/vocabulary/vocabulary-slice';
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

interface VocabularyProps {
  id: string;
}

export default function Vocabulary({ id }: VocabularyProps) {
  const { t } = useTranslation('common');
  const { isSmall } = useBreakpoints();
  const dispatch = useStoreDispatch();
  useEffect(() => {
    dispatch(initializeVocabularyFilter());
  }, []);

  const filter: VocabularyState['filter'] = useSelector(selectVocabularyFilter());
  const { data: concepts } = useGetConceptResultQuery(id);
  const { data: info } = useGetVocabularyQuery(id);
  const [showModal, setShowModal] = useState(false);

  return (
    <>
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
        {concepts &&
          <ResultAndStatsWrapper>
            <SearchResults
              data={concepts}
              filter={filter}
              setSomeFilter={setVocabularyFilter}
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
              />
            </ModalContent>
          </Modal>
        }
      </ResultAndFilterContainer>
    </>
  );
};
