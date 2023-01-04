import { useState } from 'react';
import {
  MultiSelectData,
  MultiSelectProps,
  Paragraph,
  Text,
} from 'suomifi-ui-components';
import {
  LanguageBlock,
  NameInput,
  MultiSelect,
  DescriptionInput,
} from './language-selector.styles';

interface LanguageBlockType {
  labelText: string;
  uniqueItemId: string;
  title: string;
  description: string;
}

export default function LanguageSelector(
  props: MultiSelectProps<LanguageBlockType> & {
    setLanguages: (value: LanguageBlockType[]) => void;
    disabled?: boolean;
    isWide?: boolean;
  }
) {
  const [selectedItems, setSelectedItems] = useState<MultiSelectData[]>([]);

  const handleTitleChange = (value: string, id: string) => {
    props.setLanguages(
      props.items.map((item) => {
        if (item.uniqueItemId !== id) {
          return item;
        }

        return {
          ...item,
          title: value.trim(),
        };
      })
    );
  };

  const handleDescriptionChange = (value: string, id: string) => {
    props.setLanguages(
      props.items.map((item) => {
        if (item.uniqueItemId !== id) {
          return item;
        }

        return {
          ...item,
          description: value.trim(),
        };
      })
    );
  };

  return (
    <>
      <MultiSelect
        items={props.items}
        chipListVisible={true}
        labelText={props.labelText}
        hintText={props.hintText}
        visualPlaceholder={props.visualPlaceholder}
        $isWide={props.isWide}
        allowItemAddition={false}
        selectedItems={selectedItems}
        onItemSelectionsChange={(e) => setSelectedItems(e)}
        onRemoveAll={() => setSelectedItems([])}
        defaultSelectedItems={selectedItems}
        ariaChipActionLabel={props.ariaChipActionLabel ?? ''}
        ariaSelectedAmountText={props.ariaSelectedAmountText ?? ''}
        ariaOptionsAvailableText={props.ariaOptionsAvailableText ?? ''}
        ariaOptionChipRemovedText={props.ariaOptionChipRemovedText ?? ''}
        noItemsText={props.noItemsText ?? ''}
      />

      {selectedItems.map((item, idx) => (
        <LanguageBlock
          padding="m"
          className="language-block"
          key={`${item.uniqueItemId}-${idx}`}
        >
          <Paragraph marginBottomSpacing="m">
            <Text variant="bold">{item.labelText}</Text>
          </Paragraph>
          <NameInput
            labelText="Tietomallin nimi"
            className={'name-input'}
            onBlur={(e) => handleTitleChange(e.target.value, item.uniqueItemId)}
          />
          <DescriptionInput
            labelText="Kuvaus"
            className={'description-input'}
            optionalText="valinnainen"
            onBlur={(e) =>
              handleDescriptionChange(e.target.value, item.uniqueItemId)
            }
          />
        </LanguageBlock>
      ))}
    </>
  );
}
