import { useGetConceptResultQuery, useGetVocabularyQuery } from './vocabulary-slice';
import VocabularyResults from './vocabulary-results';
import VocabularyInfo from './vocabulary-info';
import VocabularyTitle from './vocabulary-title';
import VocabularyFilter from './vocabulary-filter';
import { ResultFilterWrapper } from './vocabulary.styles';

export default function Vocabulary({ id }: any) {

  const { data: concepts } = useGetConceptResultQuery(id);
  const { data: info } = useGetVocabularyQuery(id);


  return (
    <>
      {info && <VocabularyTitle data={info} />}

      {info && <VocabularyInfo data={info} />}

      <ResultFilterWrapper>
        {concepts && <VocabularyResults concepts={concepts?.concepts} />}
        <VocabularyFilter />
      </ResultFilterWrapper>

    </>
  );
};
