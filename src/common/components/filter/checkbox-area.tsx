import { useTranslation } from 'next-i18next';
import { FilterCheckbox } from './filter.styles';
import { Text } from 'suomifi-ui-components';
import { AppThunk, useStoreDispatch } from '../../../store';
import { VocabularyState } from '../vocabulary/vocabulary-slice';
import { SearchState } from '../terminology-search/terminology-search-slice';

interface InfoDProp {
  id: string;
  value: string;
}

interface CheckboxProps {
  data?: InfoDProp[] | null[];
  filter: VocabularyState['filter'] | SearchState['filter'];
  setFilter: (x: any) => AppThunk;
  title: string;
  type?: string;
}

export default function CheckboxArea({ data, filter, setFilter, title, type }: CheckboxProps) {
  const { t } = useTranslation('common');
  const dispatch = useStoreDispatch();

  const handleCheckbox = (s: string | InfoDProp) => {
    let temp = filter;

    if (type === undefined && typeof s === 'string') {
      if (temp.status[s] === false || temp.status[s] === undefined) {
        temp = { ...temp, status: { ...temp.status, [s]: true } };
      } else {
        temp = { ...temp, status: { ...temp.status, [s]: false } };
      }
    } else if (type === 'infoDomains' && 'infoDomains' in temp && typeof s !== 'string') {
      if (temp.infoDomains.filter((infoD: InfoDProp) => infoD.id === s.id).length > 0) {
        temp = { ...temp, infoDomains: temp.infoDomains.filter((infoD: InfoDProp) => infoD.id !== s.id) };
      } else {
        temp = { ...temp, infoDomains: [...temp.infoDomains, s] };
      }
    }

    dispatch(setFilter(temp));
  };

  /* If any data isn't provided returns basic template

    [X] Valid
    [X] Draft
    [ ] Retired
    [ ] Superseded
  */
  if (data === undefined) {
    return (
      <div>
        <Text variant='bold' smallScreen>
          {title}
        </Text>
        <FilterCheckbox
          onClick={() => handleCheckbox('VALID')}
          checked={filter.status?.['VALID'] as boolean}
        >
          {t('VALID')} (n {t('vocabulary-filter-items')})
        </FilterCheckbox>
        <FilterCheckbox
          onClick={() => handleCheckbox('DRAFT')}
          checked={filter.status?.['DRAFT'] as boolean}
        >
          {t('DRAFT')} (n {t('vocabulary-filter-items')})
        </FilterCheckbox>
        <FilterCheckbox
          onClick={() => handleCheckbox('RETIRED')}
          checked={filter.status?.['RETIRED'] as boolean}
        >
          {t('RETIRED')} (n {t('vocabulary-filter-items')})
        </FilterCheckbox>
        <FilterCheckbox
          onClick={() => handleCheckbox('SUPERSEDED')}
          checked={filter.status?.['SUPERSEDED'] as boolean}
        >
          {t('SUPERSEDED')} (n {t('vocabulary-filter-items')})
        </FilterCheckbox>
      </div>
    );
  } else if (type === 'infoDomains' && 'infoDomains' in filter) {
    /* Return checkboxes according to given data.

      [ ] Data-1
      [ ] Data-2
      [ ] Data-3
      [ ] Data-4
      ...
    */

    return (
      <div>
        <Text variant='bold' smallScreen>
          {title}
        </Text>
        {data.map((d: any) => {
          return (
            <FilterCheckbox
              key={`checkbox-${d.value}-${d.id}`}
              onClick={() => handleCheckbox(d)}
              checked={
                filter.infoDomains?.filter((infoD: InfoDProp) => infoD.id === d.id).length > 0
              }
            >
              {d.value} (n {t('vocabulary-filter-items')})
            </FilterCheckbox>
          );
        })}
      </div>
    );
  }

  return <></>;
}
