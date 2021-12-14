import { setCurrentTerminology, useGetConceptResultQuery, useGetVocabularyQuery } from '../../common/components/vocabulary/vocabulary-slice';
import VocabularyResults from '../../common/components/vocabulary/vocabulary-results';
import VocabularyInfo from '../../common/components/vocabulary/vocabulary-info';
import VocabularyTitle from '../../common/components/vocabulary/vocabulary-title';
import VocabularyFilter from '../../common/components/vocabulary/vocabulary-filter';
import { ResultFilterWrapper } from '../../common/components/vocabulary/vocabulary.styles';
import { VocabularyInfoDTO, VocabularyConceptsDTO } from '../../common/interfaces/vocabulary.interface';
import { useStoreDispatch } from '../../store';
import { useEffect } from 'react';
import { useTranslation } from 'next-i18next';

interface VocabularyProps {
  id: string;
}

export default function Vocabulary({ id }: VocabularyProps) {
  const { i18n } = useTranslation('common');
  const { data: concepts } = useGetConceptResultQuery(id);
  const { data: info } = useGetVocabularyQuery(id);
  const dispatch = useStoreDispatch();

  useEffect(() => {
    dispatch(setCurrentTerminology({
      id: info?.id,
      value: info?.properties.prefLabel.filter((pl: any) => pl.lang === i18n.language)[0].value
    }
    ));
  }, [info]);


  return (
    <>
      {info && <VocabularyTitle data={info as VocabularyInfoDTO} />}

      {info && <VocabularyInfo data={info as VocabularyInfoDTO} />}

      {concepts &&
        <ResultFilterWrapper>
          <VocabularyResults concepts={concepts?.concepts as [VocabularyConceptsDTO]} />
          <VocabularyFilter />
        </ResultFilterWrapper>
      }
    </>
  );
};
