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
import { useTranslation } from 'react-i18next';

export default function VocabularyFilter() {
  const { t } = useTranslation('common');
  const dispatch = useStoreDispatch();
  const filter = useSelector(selectVocabularyFilter());

  const handleCheckbox = (s: string) => {
    let temp = filter;

    if (temp.status[s] === false || temp.status[s] === undefined) {
      temp = { ...temp, status: { ...temp.status, [s]: true } };
    } else {
      temp = { ...temp, status: { ...temp.status, [s]: false } };
    }

    dispatch(setVocabularyFilter(temp));
  };

  const handleShowBy = (s: string) => {
    let temp = filter;

    if (s === 'concept-group') {
      Object.keys(temp.status).forEach(k => {
        temp = { ...temp, status: { ...temp.status, [k]: false } };
      });
    }

    dispatch(setVocabularyFilter({ ...temp, showBy: s }));
  };

  const handleKeywordChange = (s: string) => {
    if (s === '') {
      dispatch(setVocabularyFilter({ ...filter, keyword: s, tKeyword: s }));
    } else {
      dispatch(setVocabularyFilter({ ...filter, tKeyword: s }));
    }
  };

  const handleKeyword = (s: string) => {
    dispatch(setVocabularyFilter({ ...filter, keyword: s }));
  };

  const clearFilters = () => {
    dispatch(resetVocabularyFilter(filter.showBy));
  };

  return (
    <div>
      <VocabularyFilterHeader>
        {t('vocabulary-filter-filter-list')}
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
                {t('vocabulary-filter-remove-all')}
              </Text>
            </VocabularyRemoveWrapper>

            <VocabularyFilterHr />
          </>
        }

        <RadioButtonGroup
          labelText={t('vocabulary-filter-show-only')}
          name='vocabulary-filter-show-only'
          defaultValue='concept'
          value={filter.showBy}
          onChange={(value) => handleShowBy(value)}
        >
          <RadioButton value='concept'>
            {t('vocabulary-filter-concepts')} (n {t('vocabulary-filter-items')})
          </RadioButton>
          <RadioButton value='concept-group' >
            {t('vocabulary-filter-collections')} (n {t('vocabulary-filter-items')})
          </RadioButton>
        </RadioButtonGroup>

        {filter.showBy === 'concept' &&
          <>
            <VocabularyFilterHr />

            <Text smallScreen variant='bold'>{t('vocabulary-filter-show-concept-states')}</Text>

            <VocabularyFilterCheckbox
              onClick={() => handleCheckbox('VALID')}
              checked={filter.status['VALID'] as boolean}
            >
              {t('VALID')} (n {t('vocabulary-filter-items')})
            </VocabularyFilterCheckbox>
            <VocabularyFilterCheckbox
              onClick={() => handleCheckbox('DRAFT')}
              checked={filter.status['DRAFT'] as boolean}
            >
              {t('DRAFT')} (n {t('vocabulary-filter-items')})
            </VocabularyFilterCheckbox>
            <VocabularyFilterCheckbox
              onClick={() => handleCheckbox('RETIRED')}
              checked={filter.status['RETIRED'] as boolean}
            >
              {t('RETIRED')} (n {t('vocabulary-filter-items')})
            </VocabularyFilterCheckbox>
            <VocabularyFilterCheckbox
              onClick={() => handleCheckbox('SUPERSEDED')}
              checked={filter.status['SUPERSEDED'] as boolean}
            >
              {t('SUPERSEDED')} (n {t('vocabulary-filter-items')})
            </VocabularyFilterCheckbox>
          </>
        }

        <VocabularyFilterHr />

        <SearchInput
          clearButtonLabel={t('vocabulary-filter-clear-filter')}
          searchButtonLabel={t('vocabulary-filter-search')}
          labelText={t('vocabulary-filter-filter-by-keyword')}
          visualPlaceholder={t('vocabulary-filter-visual-placeholder')}
          value={filter.tKeyword}
          onChange={(value) => handleKeywordChange(value as string)}
          onSearch={(value) => handleKeyword(value as string)}
        />
      </VocabularyFilterContainer>
    </div>
  );
}
