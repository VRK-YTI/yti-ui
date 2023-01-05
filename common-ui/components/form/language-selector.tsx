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

export interface LanguageBlockType {
  labelText: string;
  uniqueItemId: string;
  title: string;
  description: string;
  selected: boolean;
}

export default function LanguageSelector(
  props: MultiSelectProps<LanguageBlockType> & {
    languages: LanguageBlockType[];
    setLanguages: (value: LanguageBlockType[]) => void;
    userPosted: boolean;
    disabled?: boolean;
    isWide?: boolean;
  }
) {
  const [selectedItems, setSelectedItems] = useState<MultiSelectData[]>([]);

  const handleSelectedChange = (value: MultiSelectData[]) => {
    setSelectedItems(value);

    const selectedIds = value.map((item) => item.uniqueItemId);

    props.setLanguages(
      props.items.map((item) => {
        if (!selectedIds.includes(item.uniqueItemId)) {
          return {
            ...item,
            selected: false,
          };
        }

        return {
          ...item,
          selected: true,
        };
      })
    );
  };

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
        onItemSelectionsChange={(e) => handleSelectedChange(e)}
        onRemoveAll={() => setSelectedItems([])}
        defaultSelectedItems={selectedItems}
        ariaChipActionLabel={props.ariaChipActionLabel ?? ''}
        ariaSelectedAmountText={props.ariaSelectedAmountText ?? ''}
        ariaOptionsAvailableText={props.ariaOptionsAvailableText ?? ''}
        ariaOptionChipRemovedText={props.ariaOptionChipRemovedText ?? ''}
        noItemsText={props.noItemsText ?? ''}
        status={props.status}
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
            status={
              props.userPosted &&
              props.languages.find((l) => l.uniqueItemId === item.uniqueItemId)
                ?.title === ''
                ? 'error'
                : 'default'
            }
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
