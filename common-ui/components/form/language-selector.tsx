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
import { TEXT_AREA_MAX, TEXT_INPUT_MAX } from '../../utils/constants';

export interface LanguageBlockType {
  labelText: string;
  uniqueItemId: string;
  title: string;
  description: string;
  selected: boolean;
}

export default function LanguageSelector(
  props: MultiSelectProps<LanguageBlockType> & {
    setLanguages: (value: LanguageBlockType[]) => void;
    userPosted: boolean;
    translations: {
      textInput: string;
      textDescription: string;
      optionalText: string;
    };
    disabled?: boolean;
    isWide?: boolean;
  }
) {
  const [selectedItems, setSelectedItems] = useState<
    (MultiSelectData & LanguageBlockType)[]
  >(props.defaultSelectedItems ?? []);

  const handleSelectedChange = (
    value: (MultiSelectData & LanguageBlockType)[]
  ) => {
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
        onItemSelectionsChange={(e) =>
          handleSelectedChange(e as (MultiSelectData & LanguageBlockType)[])
        }
        onRemoveAll={() => setSelectedItems([])}
        defaultSelectedItems={selectedItems}
        ariaChipActionLabel={props.ariaChipActionLabel ?? ''}
        ariaSelectedAmountText={props.ariaSelectedAmountText ?? ''}
        ariaOptionsAvailableText={props.ariaOptionsAvailableText ?? ''}
        ariaOptionChipRemovedText={props.ariaOptionChipRemovedText ?? ''}
        noItemsText={props.noItemsText ?? ''}
        status={props.status}
        disabled={props.disabled}
        id="language-selector"
      />

      {selectedItems.map((item, idx) => (
        <LanguageBlock
          padding="m"
          className="language-block"
          key={`${item.uniqueItemId}-${idx}`}
          id={`language-block-${item.uniqueItemId}`}
        >
          <Paragraph mb="m">
            <Text variant="bold">{item.labelText}</Text>
          </Paragraph>
          <NameInput
            labelText={props.translations.textInput}
            className={'name-input'}
            onBlur={(e) => handleTitleChange(e.target.value, item.uniqueItemId)}
            status={
              props.userPosted &&
              props.items.find((l) => l.uniqueItemId === item.uniqueItemId)
                ?.title === ''
                ? 'error'
                : 'default'
            }
            defaultValue={item.title}
            id={`name-input-${item.uniqueItemId}`}
            maxLength={TEXT_INPUT_MAX}
          />
          <DescriptionInput
            labelText={props.translations.textDescription}
            className={'description-input'}
            optionalText={props.translations.optionalText}
            onBlur={(e) =>
              handleDescriptionChange(e.target.value, item.uniqueItemId)
            }
            defaultValue={item.description}
            id={`description-input-${item.uniqueItemId}`}
            maxLength={TEXT_AREA_MAX}
          />
        </LanguageBlock>
      ))}
    </>
  );
}
