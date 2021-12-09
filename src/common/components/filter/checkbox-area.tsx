import { useTranslation } from 'next-i18next';
import { FilterCheckbox } from './filter.styles';
import { Text } from 'suomifi-ui-components';
import { AppThunk, useStoreDispatch } from '../../../store';
import { VocabularyState } from '../vocabulary/vocabulary-slice';
import { SearchState } from '../terminology-search/terminology-search-slice';

interface CheckboxProps {
  data?: string[] | null[];
  filter: VocabularyState['filter'] | SearchState['filter'];
  setFilter: (x: any) => AppThunk;
  title: string;
  type?: string;
}

export default function CheckboxArea({ data, filter, setFilter, title, type }: CheckboxProps) {
  const { t } = useTranslation('common');
  const dispatch = useStoreDispatch();

  const handleCheckbox = (s: string) => {
    let temp = filter;

    if (type === undefined) {
      if (temp.status[s] === false || temp.status[s] === undefined) {
        temp = { ...temp, status: { ...temp.status, [s]: true } };
      } else {
        temp = { ...temp, status: { ...temp.status, [s]: false } };
      }
    } else if (type === 'infoDomains' && 'infoDomains' in temp) {
      if (temp.infoDomains[s] === false || temp.infoDomains[s] === undefined) {
        temp = { ...temp, infoDomains: { ...temp.infoDomains, [s]: true } };
      } else {
        temp = { ...temp, infoDomains: { ...temp.infoDomains, [s]: false } };
      }
    }

    dispatch(setFilter(temp));
  };

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
    return (
      <div>
        <Text variant='bold' smallScreen>
          {title}
        </Text>
        {data.map((value: any, idx: number) => {
          return (
            <FilterCheckbox key={`checkbox-${value}-${idx}`}
              onClick={() => handleCheckbox(value)}
              checked={
                filter.infoDomains?.[value] !== undefined &&
                filter.infoDomains?.[value] as boolean
              }
            >
              {value} (n {t('vocabulary-filter-items')})
            </FilterCheckbox>
          );
        })}
      </div>
    );
  }

  return (
    <div>
      <Text variant='bold' smallScreen>
        {title}
      </Text>
      {data.map((value: any, idx: number) => {
        return (
          <FilterCheckbox key={`checkbox-${value}-${idx}`}>
            {value} (n {t('vocabulary-filter-items')})
          </FilterCheckbox>
        );
      })}
    </div>
  );
}
