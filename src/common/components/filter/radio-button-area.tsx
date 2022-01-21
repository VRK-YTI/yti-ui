import { useTranslation } from 'react-i18next';
import { RadioButtonGroup } from 'suomifi-ui-components';
import { AppThunk, useStoreDispatch } from '../../../store';
import { Counts } from '../../interfaces/counts.interface';
import { VocabularyState } from '../vocabulary/vocabulary-slice';
import { FilterRadioButton } from './filter.styles';

interface RadioButtonProps {
  data: string[];
  filter: VocabularyState['filter'];
  setFilter: (x: any) => AppThunk;
  title: string;
  isModal?: boolean;
  counts?: Counts;
}

export default function RadioButtonArea({ filter, data, setFilter, title, isModal, counts }: RadioButtonProps) {
  const { t } = useTranslation('common');
  const dispatch = useStoreDispatch();

  const handleShowBy = (s: string) => {
    let retVal: VocabularyState['filter'] | undefined;

    if (s === 'collections') {
      let status = {};
      Object.keys(filter.status).forEach(k => {
        status = {...status, [k]: false};
      });
      retVal = {...filter, status: status};
    } else {
      Object.keys(filter.status).forEach(_ => {
        retVal = { ...filter, status: { ...filter.status, 'VALID': true, 'DRAFT': true } };
      });
    }

    if (retVal) {
      dispatch(setFilter({ ...retVal, showBy: s }));
    }
  };

  // *Currently* returns two radio buttons that change values between concepts and collections.
  return (
    <div>
      <RadioButtonGroup
        labelText={title}
        name='vocabulary-filter-show-only'
        defaultValue='concepts'
        value={filter.showBy}
        onChange={(value) => handleShowBy(value)}
      >
        {data.map((value: string, idx: number) => {
          const key = value.charAt(0).toUpperCase() + value.slice(1, -1);

          return (
            <FilterRadioButton
              value={value}
              key={`radio-button-${value}-${idx}`}
              checked={value === filter.showBy}
              variant={isModal ? 'large' : 'small'}
            >
              {t(`vocabulary-filter-${value}`)} ({counts?.counts?.categories?.[key]} {t('vocabulary-filter-items')})
            </FilterRadioButton>
          );
        })}
      </RadioButtonGroup>
    </div>
  );
}
