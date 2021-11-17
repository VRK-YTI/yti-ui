import { useGetConceptResultQuery, useGetVocabularyQuery } from './vocabulary-slice';
import VocabularyResults from './vocabulary-results';
import VocabularyInfo from './vocabulary-info';

export default function Vocabulary({ id }: any) {

  const { data: concepts } = useGetConceptResultQuery(id);
  const { data: info } = useGetVocabularyQuery(id);


  return (
    <>
      {/* {console.log(data?.concepts)} */}
      {console.log(info)}
      {info && <VocabularyInfo data={info} />}
      <VocabularyResults concepts={concepts?.concepts} />
    </>
  );
};
