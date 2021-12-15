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
  data?: InfoDProp[];
  filter: VocabularyState['filter'] | SearchState['filter'];
  setFilter: (x: any) => AppThunk;
  title: string;
  type?: string;
}

export default function CheckboxArea({ data, filter, setFilter, title, type }: CheckboxProps) {
  const { t } = useTranslation('common');
  const dispatch = useStoreDispatch();

  const handleCheckbox = (s: string | InfoDProp) => {
    let retVal: CheckboxProps['filter'] | undefined;

    if (typeof s === 'string') {
      if (filter.status[s] === false || filter.status[s] === undefined) {
        retVal = { ...filter, status: { ...filter.status, [s]: true } };
      } else {
        retVal = { ...filter, status: { ...filter.status, [s]: false } };
      }
    } else if ('infoDomains' in filter && typeof s !== 'string') {
      if (filter.infoDomains.filter((infoD: InfoDProp) => infoD.id === s.id).length > 0) {
        retVal = { ...filter, infoDomains: filter.infoDomains.filter((infoD: InfoDProp) => infoD.id !== s.id) };
      } else {
        retVal = { ...filter, infoDomains: [...filter.infoDomains, s] };
      }
    }

    if (retVal) {
      dispatch(setFilter(retVal));
    }
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
        {data.map((d: InfoDProp) => {
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
