import { useEffect } from 'react';
import {
  initializeVocabularyFilter,
  resetVocabularyFilter,
  setVocabularyFilter,
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
import { useTranslation } from 'next-i18next';
import BreadcrumbNav from '../../common/components/breadcrumb/breadcrumb';

interface VocabularyProps {
  id: string;
}

export default function Vocabulary({ id }: VocabularyProps) {
  const { t, i18n } = useTranslation('common');
  const dispatch = useStoreDispatch();
  const filter: VocabularyState['filter'] = useSelector(selectVocabularyFilter());
  const { data: concepts } = useGetConceptResultQuery(id);
  const { data: info } = useGetVocabularyQuery(id);
  const title = info?.properties.prefLabel.filter(pl => pl.lang === i18n.language)[0].value ?? '';

  useEffect(() => {
    dispatch(initializeVocabularyFilter());
  }, []);

  useEffect(() => {
    if (info) {
      dispatch(setCurrentTerminology({
        id: info?.id,
        value: info?.properties.prefLabel.filter((pl: any) => pl.lang === i18n.language)[0].value
      }
      ));
    }
  }, [info]);

  return (
    <>
      <BreadcrumbNav
        title={{ value: title, url: id }}
        breadcrumbs={[{ value: t('terminology-title'), url: 'search' }]}
      />
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
