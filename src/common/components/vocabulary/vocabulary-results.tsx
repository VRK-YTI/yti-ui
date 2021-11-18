import { useTranslation } from 'react-i18next';
import { Text } from 'suomifi-ui-components';
import {
  DefinitionDiv,
  ResultContainer,
  ResultHeading,
  ResultWrapper,
  TypeStatusWrapper
} from './vocabulary-results.styles';

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

export default function VocabularyResults({ concepts }: any) {
  const { t } = useTranslation('common');

  return (
    <ResultContainer>
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
