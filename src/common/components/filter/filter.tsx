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
  Hr
} from './filter.styles';
import { vocabularyEmptyState, VocabularyState } from '../vocabulary/vocabulary-slice';
import { initialState, SearchState } from '../terminology-search/terminology-search-slice';
import { AppThunk } from '../../../store';
import { CommonInfoDTO, GroupSearchResult, OrganizationSearchResult } from '../../interfaces/terminology.interface';
import { isEqual } from 'lodash';
import { Button, Icon } from 'suomifi-ui-components';

export interface FilterProps {
  filter: VocabularyState['filter'] | SearchState['filter'];
  groups?: GroupSearchResult[];
  organizations?: OrganizationSearchResult[];
  resetSomeFilter: () => AppThunk;
  setSomeFilter: (x: any) => AppThunk;
  type: string;
  isModal?: boolean;
  setShowModal?: Dispatch<SetStateAction<boolean>>;
}

export default function Filter({
  filter,
  groups,
  organizations,
  resetSomeFilter,
  setSomeFilter,
  type,
  isModal,
  setShowModal
}: FilterProps) {
  const { t, i18n } = useTranslation('common');

  // Returns filter according to templates found below.
  if (type === 'vocabulary' && 'showBy' in filter) {
    return (
      <FilterWrapper isModal={isModal}>SULJE
        {renderTitle()}
        {/* If filter has any value 'checked' Remove-component is displayed. */}
        {renderRemove()}
        {renderRadioButtonArea()}
        <Hr />
        {renderCheckboxArea(true)}
        <Hr />
        {renderSearchInputArea()}
        {isModal
          ?
          <>
            <Hr />
            <div>
              <Button fullWidth>{t('close')}</Button>
            </div>
          </>
          : null
        }
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
        />
      );
    }
  }

  function renderCloseButton() {
    if (isModal) {
      return (
        <>
          <Hr />
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
    } else {
      return null;
    }
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
        />
      );
    }
  }

  function renderRemove() {
    if (type === 'vocabulary') {
      return (
        !isEqual(filter, vocabularyEmptyState.filter) &&
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
      />
    );
  }

  function renderTitle() {
    if (isModal) {
      return (
        <Header>
          {t('vocabulary-filter-filter-list').toUpperCase()}
          <span onClick={() => setShowModal && setShowModal(false)}>
            {t('close').toUpperCase()} <Icon icon='close' />
          </span>
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
