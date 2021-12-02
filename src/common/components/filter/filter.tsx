import { useTranslation } from 'react-i18next';
import CheckboxArea from './checkbox-area';
import RadioButtonArea from './radio-button-area';
import Remove from './remove';
import SearchInputArea from './search-input-area';
import DropdownArea from './dropdown-area';
import {
  FilterWrapper,
  Header,
  Hr
} from './filter.styles';
import { vocabularyEmptyState } from '../vocabulary/vocabulary-slice';

interface FilterProps {
  filter: any;
  resetSomeFilter?: any;
  setSomeFilter: any;
  type: string;
}

export default function Filter({ filter, resetSomeFilter, setSomeFilter, type }: FilterProps) {
  const { t } = useTranslation('common');

  if (type === 'vocabulary') {
    return (
      <FilterWrapper>
        <Header>
          {t('vocabulary-filter-filter-list')}
        </Header>
        {filter !== vocabularyEmptyState.filter &&
          <>
            <Remove
              title={t('vocabulary-filter-remove-all')}
              filter={filter}
              resetFilter={resetSomeFilter}
            />
            <Hr />
          </>
        }
        <RadioButtonArea
          title={t('vocabulary-filter-show-only')}
          data={['concepts', 'collections']}
          filter={filter}
          setFilter={setSomeFilter}
        />
        {filter.showBy === 'concepts' &&
          <>
            <Hr />
            <CheckboxArea
              title={t('vocabulary-filter-show-concept-states')}
              filter={filter}
              setFilter={setSomeFilter}
            />
          </>
        }
        <Hr />
        <SearchInputArea
          title={t('vocabulary-filter-filter-by-keyword')}
          filter={filter}
          setFilter={setSomeFilter}
          visualPlaceholder={t('vocabulary-filter-visual-placeholder')}
        />
      </FilterWrapper>
    );
  }

  return <></>;
}
