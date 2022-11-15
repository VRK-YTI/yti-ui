import { Checkbox, CheckboxGroup } from "suomifi-ui-components";

export interface Item {
  value: string;
  label: React.ReactNode;
}

export interface CheckboxFilterProps {
  title: string;
  items: Item[];
  selectedItems: string[];
  onChange?: (selectedItems: string[]) => void;
  checkboxVariant: "large" | "small";
}

export default function CheckboxFilter({
  title,
  items,
  selectedItems,
  onChange,
  checkboxVariant,
}: CheckboxFilterProps) {
  return (
    <CheckboxGroup labelText={title} className="filter-checkbox-group">
      {items.map(({ value, label }: Item) => (
        <Checkbox
          key={value}
          onClick={({ checkboxState }) => update(value, checkboxState)}
          checked={selectedItems.includes(value)}
          variant={checkboxVariant}
          className="filter-checkbox-item"
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
