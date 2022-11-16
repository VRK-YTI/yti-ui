import { useState } from 'react';
import RadioButtonFilter, { Item } from './radio-button-filter';

export interface StatusFilterRadioProps {
  title: string;
  items: Item[];
  isModal?: boolean;
}

export default function StatusFilterRadio({
  title,
  items,
  isModal,
}: StatusFilterRadioProps) {
  // This should removed when urlState supports changes needed for this component to work
  const [selectedItem, setSelectedItem] = useState(items[0].value);

  return (
    <RadioButtonFilter
      title={title}
      items={items}
      onChange={(e) => setSelectedItem(e)}
      radioButtonVariant={isModal ? 'large' : 'small'}
      selectedItem={selectedItem}
    />
  );
}
