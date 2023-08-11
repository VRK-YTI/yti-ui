import { Checkbox, CheckboxGroup } from 'suomifi-ui-components';

export interface Item {
  value: string;
  label: React.ReactNode;
}

export interface CheckboxFilterProps {
  title: string;
  items: Item[];
  selectedItems: string[];
  onChange?: (selectedItems: string[]) => void;
  checkboxVariant: 'large' | 'small';
  id?: string;
}

export default function CheckboxFilter({
  title,
  items,
  selectedItems,
  onChange,
  checkboxVariant,
  id,
}: CheckboxFilterProps) {
  return (
    <CheckboxGroup
      labelText={title}
      className="filter-checkbox-group"
      id={id ?? `filter-checkbox-${title}`}
    >
      {items.map(({ value, label }: Item) => (
        <Checkbox
          key={value}
          onClick={({ checkboxState }) => update(value, checkboxState)}
          checked={selectedItems.includes(value)}
          variant={checkboxVariant}
          className="filter-checkbox-item"
          id={`filter-checkbox-${value}`}
        >
          {label}
        </Checkbox>
      ))}
    </CheckboxGroup>
  );

  function update(item: string, isSelected: boolean) {
    const others = selectedItems.filter((other) => other && other !== item);

    if (isSelected) {
      others.push(item);
    }

    onChange?.(others.sort());
  }
}
