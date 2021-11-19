import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Icon, Text } from 'suomifi-ui-components';
import {
  DefinitionDiv,
  FilterTag,
  ResultContainer,
  ResultHeading,
  ResultWrapper,
  TypeStatusWrapper
} from './vocabulary-results.styles';
import { selectVocabularyFilter } from './vocabulary-slice';

export function VocabularyResult({ concept, t }: any) {

  return (
    <>
      <ResultHeading variant='h3'>{concept.label.fi}</ResultHeading>
      <TypeStatusWrapper>
        <span>KÄSITE</span>
        <span>&middot;</span>
        <span>{t(`${concept.terminology.status}`).toUpperCase()}</span>
      </TypeStatusWrapper>
      <DefinitionDiv>{concept.definition.fi}</DefinitionDiv>
    </>
  );
}

export function VocabularyFilters() {
  const filter = useSelector(selectVocabularyFilter());
  let activeStatuses: string[] = [];

  Object.keys(filter.status).map(key => {
    if (filter.status[key] === true) {
      activeStatuses.push(key);
    }
  });

  return (
    <>
      {activeStatuses.map(activeStatus => {
        return (
          <FilterTag key={activeStatus}>
            {activeStatus}
            <Icon icon='close' />
          </FilterTag>
        );
      })}
      <FilterTag>
        {filter.keyword}
        <Icon icon='close' />
      </FilterTag>
    </>
  );
}

export default function VocabularyResults({ concepts }: any) {
  const { t } = useTranslation('common');

  return (
    <ResultContainer>
      <VocabularyFilters />
      <Text variant='bold'>
        Käsitteitä {concepts.length} kpl seuraavilla rajauksilla
      </Text>
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
