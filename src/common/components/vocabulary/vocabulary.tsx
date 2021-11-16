import { useGetConceptResultQuery } from './vocabulary-slice';
import VocabularyResults from './vocabulary-results';

export default function Vocabulary({ id }: any) {

  const { data } = useGetConceptResultQuery(id);

  return (
    <>
      {console.log(data?.concepts)}
      <VocabularyResults concepts={data?.concepts} />
    </>
  );
};
