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
  groups?: any;
  resetSomeFilter?: any;
  setSomeFilter: any;
  type: string;
}

export default function Filter({ filter, groups, resetSomeFilter, setSomeFilter, type }: FilterProps) {
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
  } else if (type === 'terminology-search') {
    return (
      <FilterWrapper>
        <Header>
          {t('vocabulary-filter-filter-list')}
        </Header>

        {/* Add organisations from api as data here*/}
        <DropdownArea
          data={groups}
          filter={filter}
          setFilter={setSomeFilter}
          title={t('terminology-search-filter-by-organization')}
          visualPlaceholder={t('terminology-search-filter-pick-organization')}
        />
        <Hr />
        <SearchInputArea
          title={t('vocabulary-filter-filter-by-keyword')}
          filter={filter}
          setFilter={setSomeFilter}
          visualPlaceholder={t('vocabulary-filter-visual-placeholder')}
        />
        <Hr />
        <CheckboxArea
          title={t('terminology-search-filter-show-states')}
          filter={filter}
          setFilter={setSomeFilter}
        />
        <Hr />
        <CheckboxArea
          title={t('terminology-search-filter-show-by-information-domain')}
          filter={filter}
          setFilter={setSomeFilter}
          data={['Test1', 'Test2']}
        />
      </FilterWrapper>
    );
  }

  return <></>;
}
