import { useStoreDispatch } from '../../../store';
import {
  resetVocabularyFilter,
  selectVocabularyFilter,
  setVocabularyFilter,
} from './vocabulary-slice';
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
import { useSelector } from 'react-redux';

export default function VocabularyFilter() {
  const dispatch = useStoreDispatch();
  const filter = useSelector(selectVocabularyFilter());

  const handleCheckbox = (s: string) => {
    let temp = filter;

    if (temp.status[s] === false || temp.status[s] === undefined) {
      temp = {...temp, status: {...temp.status, [s]: true}};
    } else {
      temp = {...temp, status: {...temp.status, [s]: false}};
    }

    dispatch(setVocabularyFilter(temp));
  };

  const handleShowBy = (s: string) => {
    let temp = filter;

    if (s === 'concept-group') {
      Object.keys(temp.status).forEach(k => {
        temp = {...temp, status: {...temp.status, [k]: false}};
      });
    }

    dispatch(setVocabularyFilter({...temp, showBy: s}));
  };

  const handleKeywordChange = (s: string) => {
    if (s === '') {
      dispatch(setVocabularyFilter({...filter, keyword: s, tKeyword: s}));
    } else {
      dispatch(setVocabularyFilter({...filter, tKeyword: s}));
    }
  };

  const handleKeyword = (s: string) => {
    dispatch(setVocabularyFilter({...filter, keyword: s}));
  };

  const clearFilters = () => {
    dispatch(resetVocabularyFilter(filter.showBy));
  };

  return (
    <div>
      <VocabularyFilterHeader>
        RAJAA LISTAA
      </VocabularyFilterHeader>
      <VocabularyFilterContainer>
        {(Object.values(filter.status).includes(true) || filter.keyword != '') &&
          <>
            <VocabularyRemoveWrapper>
              <VocabularyFilterRemove icon='remove' />
              <Text
                smallScreen
                color='highlightBase'
                variant='bold'
                onClick={() => clearFilters()}
              >
                Poista kaikki rajaukset
              </Text>
            </VocabularyRemoveWrapper>

            <VocabularyFilterHr />
          </>
        }

        <RadioButtonGroup
          labelText='Näytä vain'
          name='vocabulary-filter-show-only'
          defaultValue='concept'
          value={filter.showBy}
          onChange={(value) => handleShowBy(value)}
        >
          <RadioButton value='concept'>
            Käsitteet (n kpl)
          </RadioButton>
          <RadioButton value='concept-group'>
            Käsitevalikoimat (n kpl)
          </RadioButton>
        </RadioButtonGroup>

        {filter.showBy === 'concept' &&
          <>
            <VocabularyFilterHr />

            <Text smallScreen variant='bold'>Näytä käsitteiden tilat</Text>

            <VocabularyFilterCheckbox
              onClick={() => handleCheckbox('VALID')}
              checked={filter.status['VALID'] as boolean}
            >
              Voimassa oleva (n kpl)
            </VocabularyFilterCheckbox>
            <VocabularyFilterCheckbox
              onClick={() => handleCheckbox('DRAFT')}
              checked={filter.status['DRAFT'] as boolean}
            >
              Luonnos (n kpl)
            </VocabularyFilterCheckbox>
            <VocabularyFilterCheckbox
              onClick={() => handleCheckbox('RETIRED')}
              checked={filter.status['RETIRED'] as boolean}
            >
              Korvattu (n kpl)
            </VocabularyFilterCheckbox>
            <VocabularyFilterCheckbox
              onClick={() => handleCheckbox('SUPERSEDED')}
              checked={filter.status['SUPERSEDED'] as boolean}
            >
              Poistettu käytöstä (n kpl)
            </VocabularyFilterCheckbox>
          </>
        }

        <VocabularyFilterHr />

        <SearchInput
          clearButtonLabel='Tyhjennä haku'
          searchButtonLabel='Hae'
          labelText='Rajaa sanalla'
          visualPlaceholder='Esim päivähoito, opiskelu...'
          value={filter.tKeyword}
          onChange={(value) => handleKeywordChange(value as string)}
          onSearch={(value) => handleKeyword(value as string)}
        />
      </VocabularyFilterContainer>
    </div>
  );
}
