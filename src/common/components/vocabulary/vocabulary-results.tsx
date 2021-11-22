import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Text } from 'suomifi-ui-components';
import { useStoreDispatch } from '../../../store';
import {
  DefinitionDiv,
  FilterTag,
  FilterTagClose,
  FilterTagWrapper,
  ResultContainer,
  ResultHeading,
  ResultWrapper,
  TypeStatusWrapper
} from './vocabulary-results.styles';
import { selectVocabularyFilter, setVocabularyFilter } from './vocabulary-slice';

export function VocabularyResult({ concept, t }: any) {
  return (
    <>
      <ResultHeading variant='h3'>{concept.label.fi}</ResultHeading>
      <TypeStatusWrapper>
        <span>{t('vocabulary-info-concept').toUpperCase()}</span>
        <span>&middot;</span>
        <span>{t(`${concept.terminology.status}`).toUpperCase()}</span>
      </TypeStatusWrapper>
      <DefinitionDiv>{concept.definition.fi}</DefinitionDiv>
    </>
  );
}

export function VocabularyFilters({ t }: any) {
  const filter = useSelector(selectVocabularyFilter());
  const dispatch = useStoreDispatch();
  let activeStatuses: string[] = [];

  Object.keys(filter.status).map(key => {
    if (filter.status[key] === true) {
      activeStatuses.push(key);
    }
  });

  const handleTagClose = (s: any) => {
    let temp = filter;
    temp = { ...temp, status: { ...temp.status, [s]: false } };
    dispatch(setVocabularyFilter(temp));
  };

  const handleKeywordClose = () => {
    dispatch(setVocabularyFilter({ ...filter, keyword: '', tKeyword: '' }));
  };

  return (
    <FilterTagWrapper>
      {
        activeStatuses.length > 0 &&
        activeStatuses.map(activeStatus => {
          return (
            <FilterTag key={activeStatus}>
              {t(`${activeStatus}`)}
              <FilterTagClose
                icon='close'
                onClick={() => handleTagClose(activeStatus)}
              />
            </FilterTag>
          );
        })
      }
      {
        filter.keyword != '' &&
        <FilterTag>
          {filter.keyword}
          <FilterTagClose
            icon='close'
            onClick={() => handleKeywordClose()}
          />
        </FilterTag>
      }
    </FilterTagWrapper>
  );
}

export default function VocabularyResults({ concepts }: any) {
  const { t } = useTranslation('common');

  return (
    <ResultContainer>
      <Text variant='bold'>
        Käsitteitä {concepts.length} kpl seuraavilla rajauksilla
      </Text>
      <VocabularyFilters t={t} />
      <ResultWrapper>
        <ul>
          {
            concepts ?
              concepts.map((concept: any) => {
                return (
                  <li key={concept.id}>
                    <VocabularyResult concept={concept} t={t} />
                  </li>
                );
              })
              :
              <></>
          }
        </ul>
      </ResultWrapper>
    </ResultContainer>
  );
}
