import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import CheckboxArea from './checkbox-area';
import RadioButtonArea from './radio-button-area';
import Remove from './remove';
import DropdownArea from './dropdown-area';
import {
  CloseWrapper,
  FilterContent,
  FilterWrapper,
  Header,
  HeaderButton
} from './filter.styles';
import { vocabularyInitialState, VocabularyState } from '../vocabulary/vocabulary-slice';
import { initialState, SearchState } from '../terminology-search/terminology-search-slice';
import { AppThunk } from '../../../store';
import { GroupSearchResult, OrganizationSearchResult } from '../../interfaces/terminology.interface';
import { isEqual } from 'lodash';
import { TextInputArea } from './text-input-area';
import Separator from '../separator';
import { Button } from 'suomifi-ui-components';
import { getPropertyValue } from '../property-value/get-property-value';
import { Counts } from '../../interfaces/counts.interface';

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
  counts?: Counts;
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
  resultCount,
  counts
}: FilterProps) {
  const { t, i18n } = useTranslation('common');

  // Returns filter according to templates found below.
  if (type === 'vocabulary' && 'showBy' in filter) {
    return (
      <FilterWrapper isModal={isModal}>
        {renderTitle()}
        <FilterContent>
          {/* If filter has any value 'checked' Remove-component is displayed. */}
          {renderRemove()}
          {renderRadioButtonArea()}
          <Separator />
          {renderCheckboxArea(true)}
          {('showBy' in filter && filter.showBy === 'concepts') && <Separator />}
          {renderTextInputArea()}
          {renderCloseButton()}
        </FilterContent>
      </FilterWrapper>
    );
  } else if (type === 'terminology-search' && 'showByOrg' in filter && groups) {
    return (
      <FilterWrapper isModal={isModal}>
        {renderTitle()}
        <FilterContent>
          {/* If filter has any value 'checked' Remove-component is displayed. */}
          {renderRemove()}
          {renderDropdownArea()}
          <Separator />
          {renderTextInputArea()}
          <Separator />
          {renderCheckboxArea(true)}
          <Separator />
          {renderCheckboxArea()}
          {renderCloseButton()}
        </FilterContent>
      </FilterWrapper>
    );
  }

  function renderCheckboxArea(common?: boolean) {
    if (common) {
      if ('showBy' in filter && filter.showBy === 'collections') {
        return <></>;
      } else {
        return (
          <CheckboxArea
            title={
              type === 'terminology-search'
                ?
                t('terminology-search-filter-show-states')
                :
                t('vocabulary-filter-show-concept-states')
            }
            filter={filter}
            setFilter={setSomeFilter}
            isModal={isModal}
            counts={counts}
          />
        );
      }
    } else if (groups) {
      return (
        <CheckboxArea
          title={t('terminology-search-filter-show-by-information-domain')}
          filter={filter}
          setFilter={setSomeFilter}
          data={
            groups.map(group => {
              let val = getPropertyValue({ property: group.properties.prefLabel, language: i18n.language }) ?? '';
              return { id: group.id as string, value: val };
            })
          }
          type='infoDomains'
          isModal={isModal}
          counts={counts}
        />
      );
    }
  }

  function renderCloseButton() {
    if (!isModal) {
      return null;
    }

    return (
      <CloseWrapper>
        <Separator />
        <div>
          {resultCount} {t('filter-with-current')}
        </div>
        <div>
          <Button
            fullWidth
            onClick={() => setShowModal?.(false)}
          >
            {t('close')}
          </Button>
        </div>
      </CloseWrapper>
    );
  }

  function renderDropdownArea() {
    if ('showByOrg' in filter) {
      return (
        <DropdownArea
          data={organizations}
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
          counts={counts}
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
          <Separator />
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
          <Separator />
        </>
      );
    }
  }

  function renderTextInputArea() {
    return (
      <>
        <TextInputArea
          title={t('vocabulary-filter-filter-by-keyword')}
          filter={filter}
          setFilter={setSomeFilter}
          visualPlaceholder={t('vocabulary-filter-visual-placeholder')}
          isModal={isModal}
        />
      </>
    );
  }

  function renderTitle() {
    if (isModal) {
      return (
        <Header>
          {t('vocabulary-filter-filter-list')}
          <HeaderButton
            iconRight='close'
            onClick={() => setShowModal?.(false)}
          >
            {t('close')}
          </HeaderButton>
        </Header>
      );
    } else {
      return (
        <Header>
          {t('vocabulary-filter-filter-list')}
        </Header>
      );
    }
  }

  return <></>;
}
