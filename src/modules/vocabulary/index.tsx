import { useEffect } from 'react';
import { initializeVocabularyFilter, resetVocabularyFilter, setVocabularyFilter, useGetConceptResultQuery, useGetVocabularyQuery, VocabularyState } from '../../common/components/vocabulary/vocabulary-slice';
import Filter from '../../common/components/filter/filter';
import SearchResults from '../../common/components/search-results/search-results';
import Title from '../../common/components/title/title';
import { ResultAndFilterContainer, ResultAndStatsWrapper } from './vocabulary.styles';
import { selectVocabularyFilter } from '../../common/components/vocabulary/vocabulary-slice';
import { useSelector } from 'react-redux';
import { useStoreDispatch } from '../../store';

interface VocabularyProps {
  id: string;
}

export default function Vocabulary({ id }: VocabularyProps) {
  const dispatch = useStoreDispatch();
  useEffect(() => {
    dispatch(initializeVocabularyFilter());
  }, []);

  const filter: VocabularyState['filter'] = useSelector(selectVocabularyFilter());
  const { data: concepts } = useGetConceptResultQuery(id);
  const { data: info } = useGetVocabularyQuery(id);

  return (
    <>
      {info && <Title info={info} />}
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
        <Filter
          filter={filter as VocabularyState['filter']}
          type={'vocabulary'}
          setSomeFilter={setVocabularyFilter}
          resetSomeFilter={resetVocabularyFilter}
        />
      </ResultAndFilterContainer>
    </>
  );
};
