import { useGetConceptResultQuery, useGetVocabularyQuery } from './vocabulary-slice';
import VocabularyResults from './vocabulary-results';
import VocabularyInfo from './vocabulary-info';
import VocabularyTitle from './vocabulary-title';
import VocabularyFilter from './vocabulary-filter';
import { ResultFilterWrapper } from './vocabulary.styles';
import { VocabularyInfoDTO, VocabularyConceptsDTO } from '../../interfaces/vocabulary.interface';

interface VocabularyProps {
  id: string;
}

export default function Vocabulary({ id }: VocabularyProps) {
  const { data: concepts } = useGetConceptResultQuery(id);
  const { data: info } = useGetVocabularyQuery(id);

  return (
    <>
      {info && <VocabularyTitle data={info as VocabularyInfoDTO} />}

      {info && <VocabularyInfo data={info as VocabularyInfoDTO} />}

      <ResultFilterWrapper>
        {concepts && <VocabularyResults concepts={concepts?.concepts as [VocabularyConceptsDTO]} />}
        <VocabularyFilter />
      </ResultFilterWrapper>
    </>
  );
};
