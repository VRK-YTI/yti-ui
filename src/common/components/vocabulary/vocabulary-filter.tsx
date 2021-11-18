import {
  RadioButton,
  RadioButtonGroup,
  SearchInput,
  Text
} from 'suomifi-ui-components';
import {
  VocabularyFilterContainer,
  VocabularyFilterCheckbox,
  VocabularyFilterHeader,
  VocabularyFilterHr,
  VocabularyFilterRemove,
  VocabularyRemoveWrapper
} from './vocabulary-filter.styles';

export default function VocabularyFilter() {

  return (
    <div>
      <VocabularyFilterHeader>
        RAJAA LISTAA
      </VocabularyFilterHeader>
      <VocabularyFilterContainer>
        <VocabularyRemoveWrapper>
          <VocabularyFilterRemove icon='remove' />
          <Text
            smallScreen
            color='highlightBase'
            variant='bold'
          >
            Poista kaikki rajaukset
          </Text>
        </VocabularyRemoveWrapper>

        <VocabularyFilterHr />

        <RadioButtonGroup
          labelText='Näytä vain'
          name='vocabulary-filter-show-only'
        >
          <RadioButton value='concept'>
            Käsitteet (n kpl)
          </RadioButton>
          <RadioButton value='concept-group'>
            Käsitevalikoimat (n kpl)
          </RadioButton>
        </RadioButtonGroup>

        <VocabularyFilterHr />

        <Text smallScreen variant='bold'>Näytä käsitteiden tilat</Text>
        <VocabularyFilterCheckbox>Voimassa oleva (n kpl)</VocabularyFilterCheckbox>
        <VocabularyFilterCheckbox>Luonnos (n kpl)</VocabularyFilterCheckbox>
        <VocabularyFilterCheckbox>Korvattu (n kpl)</VocabularyFilterCheckbox>
        <VocabularyFilterCheckbox>Poistettu käytöstä (n kpl)</VocabularyFilterCheckbox>

        <VocabularyFilterHr />

        <SearchInput
          clearButtonLabel='Tyhjennä haku'
          searchButtonLabel='Hae'
          labelText='Rajaa sanalla'
          visualPlaceholder='Esim päivähoito, opiskelu...'
        />
      </VocabularyFilterContainer>
    </div>
  );
}
