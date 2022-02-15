import { RadioButtonGroup } from 'suomifi-ui-components';
import { FilterRadioButton } from './filter.styles';

export interface Item {
  value: string;
  label: React.ReactNode;
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
  radioButtonVariant
}: RadioButtonFilterProps) {
  return (
    <div>
      <RadioButtonGroup
        labelText={title}
        name='vocabulary-filter-show-only'
        value={selectedItem}
        onChange={onChange}
      >
        {items.map(({ value, label }) => (
          <FilterRadioButton
            value={value}
            key={value}
            checked={value === selectedItem}
            variant={radioButtonVariant}
          >
            {label}
          </FilterRadioButton>
        ))}
      </RadioButtonGroup>
    </div>
  );
}
