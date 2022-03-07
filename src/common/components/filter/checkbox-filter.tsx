import { Text } from "suomifi-ui-components";
import {
  FilterFieldset,
  FilterCheckbox,
  FilterFieldsetLegend,
} from "./filter.styles";

export interface Item {
  value: string;
  label: React.ReactNode;
}

export interface CheckboxFilterProps {
  title: string;
  items: Item[];
  selectedItems: string[];
  onChange: (selectedItems: string[]) => void;
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
    <FilterFieldset>
      <FilterFieldsetLegend>
        <Text variant="bold" smallScreen>
          {title}
        </Text>
      </FilterFieldsetLegend>
      {items.map(({ value, label }: Item) => (
        <FilterCheckbox
          key={value}
          onClick={({ checkboxState }) => update(value, checkboxState)}
          checked={selectedItems.includes(value)}
          variant={checkboxVariant}
        >
          {label}
        </FilterCheckbox>
      ))}
    </FilterFieldset>
  );

  function update(item: string, isSelected: boolean) {
    const others = selectedItems.filter((other) => other && other !== item);

    if (isSelected) {
      others.push(item);
    }

    onChange(others.sort());
  }
}
