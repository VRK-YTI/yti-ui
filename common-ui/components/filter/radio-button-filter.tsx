import { useTranslation } from 'next-i18next';
import { RadioButtonGroup } from 'suomifi-ui-components';
import { FilterRadioButton } from './filter.styles';

export interface Item {
  value: string;
  label: React.ReactNode;
  hintText?: string;
}

export interface RadioButtonFilterProps {
  title: string;
  items: Item[];
  selectedItem: string;
  onChange: (selectedItem: string) => void;
  radioButtonVariant: 'large' | 'small';
}

export default function RadioButtonFilter({
  title,
  items,
  selectedItem,
  onChange,
  radioButtonVariant,
}: RadioButtonFilterProps) {
  const { t } = useTranslation('common');

  return (
    <div>
      <RadioButtonGroup
        labelText={title}
        name={t('vocabulary-filter-show-only')}
        value={selectedItem}
        onChange={onChange}
        id="filter-radio-button-group"
      >
        {items.map(({ value, label, hintText }) => (
          <FilterRadioButton
            value={value}
            key={value}
            checked={value === selectedItem}
            variant={radioButtonVariant}
            className="filter-radio-button-item"
            hintText={hintText}
          >
            {label}
          </FilterRadioButton>
        ))}
      </RadioButtonGroup>
    </div>
  );
}
