import { useState } from "react";
import CheckboxFilter from "./checkbox-filter";

interface Item {
  value: string;
  label: React.ReactNode;
}

export interface TypeCheckboxFilterProps {
  title: string,
  items: Item[];
  isModal?: boolean;
}

export default function TypeCheckboxFilter({
  title,
  items,
  isModal
}: TypeCheckboxFilterProps) {
  // This should removed when urlState supports changes needed for this component to work
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  return (
    <CheckboxFilter
      items={items}
      selectedItems={selectedItems}
      title={title}
      checkboxVariant={isModal ? 'large' : 'small'}
      onChange={(e) => setSelectedItems(Array.isArray(e) ? e : [e])}
    />
  );
}
