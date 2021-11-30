import { useTranslation } from 'react-i18next';
import { RadioButtonGroup } from 'suomifi-ui-components';
import { FilterRadioButton } from './filter.styles';

interface RadioButtonProps {
  data?: any;
  title: string;
}

export default function RadioButtonArea({ data, title }: RadioButtonProps) {
  const { t } = useTranslation('common');

  if (data === undefined) {
    return (
      <div>
        <RadioButtonGroup
          labelText={t('vocabulary-filter-show-only')}
          name='vocabulary-filter-show-only'
          defaultValue='concept'
        >
          <FilterRadioButton value='concept'>
            {t('vocabulary-filter-concepts')} (n {t('vocabulary-filter-items')})
          </FilterRadioButton>
          <FilterRadioButton value='concept-group' >
            {t('vocabulary-filter-collections')} (n {t('vocabulary-filter-items')})
          </FilterRadioButton>
        </RadioButtonGroup>
      </div>
    );
  }

  return (
    <div>
      <RadioButtonGroup
        labelText={t('vocabulary-filter-show-only')}
        name='vocabulary-filter-show-only'
        defaultValue='concept'
      >
        {data.map((value: any, idx: number) => {
          return (
            <FilterRadioButton
              value={value}
              key={`radio-button-${value}-${idx}`}
            >
              {t(`vocabulary-filter-${value}`)} (n {t('vocabulary-filter-items')})
            </FilterRadioButton>
          );
        })}
      </RadioButtonGroup>
    </div>
  );
}
