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
import { vocabularyEmptyState, VocabularyState } from '../vocabulary/vocabulary-slice';
import { initialState, SearchState } from '../terminology-search/terminology-search-slice';
import { AppThunk } from '../../../store';
import { GroupSearchResult, OrganizationSearchResult } from '../../interfaces/terminology.interface';

export interface FilterProps {
  filter: VocabularyState['filter'] | SearchState['filter'];
  groups?: GroupSearchResult[];
  organizations?: OrganizationSearchResult[];
  resetSomeFilter: () => AppThunk;
  setSomeFilter: (x: any) => AppThunk;
  type: string;
}

export default function Filter({
  filter,
  groups,
  organizations,
  resetSomeFilter,
  setSomeFilter,
  type
}: FilterProps) {
  const { t, i18n } = useTranslation('common');

  if (type === 'vocabulary' && 'showBy' in filter) {
    return (
      <FilterWrapper>
        <Header>
          {t('vocabulary-filter-filter-list')}
        </Header>
        {JSON.stringify(filter) !== JSON.stringify(vocabularyEmptyState.filter) &&
          <>
            <Remove
              title={t('vocabulary-filter-remove-all')}
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
  } else if (type === 'terminology-search' && 'showByOrg' in filter && groups) {
    return (
      <FilterWrapper>
        <Header>
          {t('vocabulary-filter-filter-list')}
        </Header>

        {
          (
            JSON.stringify({ ...filter, infoDomains: {} }) !== JSON.stringify(initialState.filter)
            ||
            Object.keys(filter.infoDomains).some((id: any) => {
              if (filter.infoDomains[id] === true) {
                return true;
              } else {
                return false;
              }
            })
          )
          &&
          <>
            <Remove
              title={t('vocabulary-filter-remove-all')}
              resetFilter={resetSomeFilter}
            />
            <Hr />
          </>
        }

        <DropdownArea
          data={organizations?.map((organization: any) => {
            let val = null;
            organization.properties.prefLabel?.map((pLabel: any) => {
              if (pLabel.lang === i18n.language) {
                val = pLabel.value;
              }
            }).sort();
            return val;
          })}
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
          data={groups.map((group: any) => {
            let val = null;
            group.properties.prefLabel?.map((pLabel: any) => {
              if (pLabel.lang === i18n.language) val = pLabel.value;
            });
            return val;
          }).sort()}
          type='infoDomains'
        />
      </FilterWrapper>
    );
  }

  return <></>;
}
