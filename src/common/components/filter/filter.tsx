import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import CheckboxArea from './checkbox-area';
import RadioButtonArea from './radio-button-area';
import Remove from './remove';
import SearchInputArea from './search-input-area';
import DropdownArea from './dropdown-area';
import {
  FilterWrapper,
  Header,
  HeaderButton,
  Hr
} from './filter.styles';
import { vocabularyInitialState, VocabularyState } from '../vocabulary/vocabulary-slice';
import { initialState, SearchState } from '../terminology-search/terminology-search-slice';
import { AppThunk } from '../../../store';
import { CommonInfoDTO, GroupSearchResult, OrganizationSearchResult } from '../../interfaces/terminology.interface';
import { isEqual } from 'lodash';
import { Button } from 'suomifi-ui-components';

export interface FilterProps {
  filter: VocabularyState['filter'] | SearchState['filter'];
  groups?: GroupSearchResult[];
  organizations?: OrganizationSearchResult[];
  resetSomeFilter: () => AppThunk;
  setSomeFilter: (x: any) => AppThunk;
  type: string;
  isModal?: boolean;
  setShowModal?: Dispatch<SetStateAction<boolean>>;
  resultCount?: number;
}

export default function Filter({
  filter,
  groups,
  organizations,
  resetSomeFilter,
  setSomeFilter,
  type,
  isModal = false,
  setShowModal,
  resultCount
}: FilterProps) {
  const { t, i18n } = useTranslation('common');

  // Returns filter according to templates found below.
  if (type === 'vocabulary' && 'showBy' in filter) {
    return (
      <FilterWrapper isModal={isModal}>
        {renderTitle()}
        {/* If filter has any value 'checked' Remove-component is displayed. */}
        {renderRemove()}
        {renderRadioButtonArea()}
        <Hr />
        {renderCheckboxArea(true)}
        {('showBy' in filter && filter.showBy === 'concepts') && <Hr />}
        {renderSearchInputArea()}
        {renderCloseButton()}
      </FilterWrapper>
    );
  } else if (type === 'terminology-search' && 'showByOrg' in filter && groups) {
    return (
      <FilterWrapper isModal={isModal}>
        {renderTitle()}
        {/* If filter has any value 'checked' Remove-component is displayed. */}
        {renderRemove()}
        {renderDropdownArea()}
        <Hr />
        {renderSearchInputArea()}
        <Hr />
        {renderCheckboxArea(true)}
        <Hr />
        {renderCheckboxArea()}
        {renderCloseButton()}
      </FilterWrapper>
    );
  }

  function renderCheckboxArea(common?: boolean) {
    if (common) {
      return (
        <CheckboxArea
          title={t('vocabulary-filter-show-concept-states')}
          filter={filter}
          setFilter={setSomeFilter}
          isModal={isModal}
        />
      );
    } else if (groups) {
      return (
        <CheckboxArea
          title={t('terminology-search-filter-show-by-information-domain')}
          filter={filter}
          setFilter={setSomeFilter}
          data={
            groups.map(group => {
              let val = '';
              group.properties.prefLabel?.find(pLabel => {
                if (pLabel.lang === i18n.language) val = pLabel.value;
              });
              return { id: group.id as string, value: val };
            })
          }
          type='infoDomains'
          isModal={isModal}
        />
      );
    }
  }

  function renderCloseButton() {
    if (!isModal) {
      return null;
    }

    return (
      <>
        <Hr />
        <div>
          {resultCount} {t('filter-with-current')}
        </div>
        <div>
          <Button
            fullWidth
            onClick={() => setShowModal && setShowModal(false)}
          >
            {t('close')}
          </Button>
        </div>
      </>
    );
  }

  function renderDropdownArea() {
    if ('showByOrg' in filter) {
      return (
        <DropdownArea
          data={organizations?.map((organization: OrganizationSearchResult) => {
            let val = '';
            organization.properties.prefLabel?.map((pLabel: CommonInfoDTO) => {
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
      );
    }
  }

  function renderRadioButtonArea() {
    if ('showBy' in filter) {
      return (
        <RadioButtonArea
          title={t('vocabulary-filter-show-only')}
          data={['concepts', 'collections']}
          filter={filter}
          setFilter={setSomeFilter}
          isModal={isModal}
        />
      );
    }
  }

  function renderRemove() {
    if (type === 'vocabulary') {
      return (
        !isEqual(filter, vocabularyInitialState.filter) &&
        <>
          <Remove
            title={t('vocabulary-filter-remove-all')}
            resetFilter={resetSomeFilter}
          />
          <Hr />
        </>

      );
    } else if (type === 'terminology-search' && 'infoDomains' in filter) {
      return (
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
      );
    }
  }

  function renderSearchInputArea() {
    return (
      <SearchInputArea
        title={t('vocabulary-filter-filter-by-keyword')}
        filter={filter}
        setFilter={setSomeFilter}
        visualPlaceholder={t('vocabulary-filter-visual-placeholder')}
        isModal={isModal}
      />
    );
  }

  function renderTitle() {
    if (isModal) {
      return (
        <Header>
          {t('vocabulary-filter-filter-list').toUpperCase()}
          <HeaderButton
            iconRight='close'
            onClick={() => setShowModal && setShowModal(false)}
          >
            {t('close').toUpperCase()}
          </HeaderButton>
        </Header>
      );
    } else {
      return (
        <Header>
          {t('vocabulary-filter-filter-list').toUpperCase()}
        </Header>
      );
    }
  }

  return <></>;
}
