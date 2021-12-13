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
import { isEqual } from 'lodash';

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

  // Returns filter according to templates found below.
  if (type === 'vocabulary' && 'showBy' in filter) {
    return (
      <FilterWrapper>
        <Header>
          {t('vocabulary-filter-filter-list')}
        </Header>

        {/* If filter has any value 'checked' Remove-component is displayed. */}
        {!isEqual(filter, vocabularyEmptyState.filter) &&
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

        {/* If filter has any value 'checked' Remove-component is displayed. */}
        {
          (
            !isEqual({ ...filter, infoDomains: [] }, initialState.filter)
            ||
            filter.infoDomains.length > 0
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
          data={
            groups.slice().sort((a, b) => {
              let valA = '';
              let valB = '';

              a.properties.prefLabel?.map((pLabel: any) => {
                if (pLabel.lang === i18n.language) valA = pLabel.value;
              });

              b.properties.prefLabel?.map((pLabel: any) => {
                if (pLabel.lang === i18n.language) valB = pLabel.value;
              });

              return valA === valB ? 0 : valA < valB ? -1 : 1;
            }).map((group: any) => {
              let val = '';

              group.properties.prefLabel?.map((pLabel: any) => {
                if (pLabel.lang === i18n.language) val = pLabel.value;
              });

              return { id: group.id as string, value: val };
            })
          }
          type='infoDomains'
        />
      </FilterWrapper>
    );
  }

  return <></>;
}
