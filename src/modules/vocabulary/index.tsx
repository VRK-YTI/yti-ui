import { useGetConceptResultQuery, useGetVocabularyQuery } from '../../common/components/vocabulary/vocabulary-slice';
import VocabularyResults from '../../common/components/vocabulary/vocabulary-results';
import VocabularyInfo from '../../common/components/vocabulary/vocabulary-info';
import VocabularyTitle from '../../common/components/vocabulary/vocabulary-title';
import VocabularyFilter from '../../common/components/vocabulary/vocabulary-filter';
import { ResultFilterWrapper } from '../../common/components/vocabulary/vocabulary.styles';
import { VocabularyInfoDTO, VocabularyConceptsDTO } from '../../common/interfaces/vocabulary.interface';
import Filter from '../../common/components/filter/filter';
import SearchResults from '../../common/components/search-results/search-results';
import Title from '../../common/components/title/title';
import { ResultAndFilterContainer, ResultAndStatsWrapper } from './vocabulary.styles';

interface VocabularyProps {
  id: string;
}

export default function Vocabulary({ id }: VocabularyProps) {
  const { data: concepts } = useGetConceptResultQuery(id);
  const { data: info } = useGetVocabularyQuery(id);

  return (
    <>
      <Title info={info}/>
      <ResultAndFilterContainer>
        <ResultAndStatsWrapper>
          <SearchResults data={concepts} />
        </ResultAndStatsWrapper>
        <Filter />
      </ResultAndFilterContainer>

      {/* {info && <VocabularyTitle data={info as VocabularyInfoDTO} />}

      {info && <VocabularyInfo data={info as VocabularyInfoDTO} />}

      {concepts &&
        <ResultFilterWrapper>
          <VocabularyResults concepts={concepts?.concepts as [VocabularyConceptsDTO]} />
          <VocabularyFilter />
        </ResultFilterWrapper>
      } */}
    </>
  );
};
