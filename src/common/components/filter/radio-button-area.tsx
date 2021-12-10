import { useTranslation } from 'react-i18next';
import { RadioButtonGroup } from 'suomifi-ui-components';
import { AppThunk, useStoreDispatch } from '../../../store';
import { VocabularyState } from '../vocabulary/vocabulary-slice';
import { FilterRadioButton } from './filter.styles';

interface RadioButtonProps {
  data: string[];
  filter: VocabularyState['filter'];
  setFilter: (x: any) => AppThunk;
  title: string;
}

export default function RadioButtonArea({ filter, data, setFilter, title }: RadioButtonProps) {
  const { t } = useTranslation('common');
  const dispatch = useStoreDispatch();

  const handleShowBy = (s: string) => {
    let temp = filter;

    if (s === 'collections') {
      Object.keys(temp.status).forEach(k => {
        temp = { ...temp, status: { ...temp.status, [k]: false } };
      });
    } else {
      Object.keys(temp.status).forEach(k => {
        temp = { ...temp, status: { ...temp.status, 'VALID': true, 'DRAFT': true } };
      });
    }

    dispatch(setFilter({ ...temp, showBy: s }));
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
        {data.map((value: any, idx: number) => {
          return (
            <FilterRadioButton
              value={value}
              key={`radio-button-${value}-${idx}`}
              checked={value === filter.showBy}
            >
              {t(`vocabulary-filter-${value}`)} (n {t('vocabulary-filter-items')})
            </FilterRadioButton>
          );
        })}
      </RadioButtonGroup>
    </div>
  );
}
