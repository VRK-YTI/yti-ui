import { useState } from 'react';
import {
  MultiSelectData,
  MultiSelectProps,
  Paragraph,
  Text,
  TextInput,
} from 'suomifi-ui-components';
import {
  LanguageBlock,
  MultiSelect,
  DescriptionInput,
  WideTextInput,
} from './mscr-language-selector.styles';
import { TEXT_AREA_MAX, TEXT_INPUT_MAX } from 'yti-common-ui/utils/constants';
import { LanguageBlockType } from 'yti-common-ui/components/form/language-selector';

export default function MscrLanguageSelector(
  props: MultiSelectProps<LanguageBlockType> & {
    setLanguages: (value: LanguageBlockType[]) => void;
    userPosted: boolean;
    setVersionLabel: (value: string) => void;
    versionLabel: string;
    versionLabelCaption: string;
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

  // const handleSelectedChange = (
  //   value: (MultiSelectData & LanguageBlockType)[]
  // ) => {
  //   setSelectedItems(value);
  //
  //   const selectedIds = value.map((item) => item.uniqueItemId);
  //
  //   props.setLanguages(
  //     props.items.map((item) => {
  //       if (!selectedIds.includes(item.uniqueItemId)) {
  //         return {
  //           ...item,
  //           selected: false,
  //         };
  //       }
  //
  //       return {
  //         ...item,
  //         selected: true,
  //       };
  //     })
  //   );
  // };

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
      {/* <MultiSelect
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
 */}
      {selectedItems.map((item, idx) => (
        <LanguageBlock
          className="language-block"
          key={`${item.uniqueItemId}-${idx}`}
          id={`language-block-${item.uniqueItemId}`}
        >
          {/*  <Paragraph marginBottomSpacing="m">
                 <Text variant="bold">{item.labelText}</Text>
               </Paragraph> */}
          <div className="row">
            <div className="col-6">
              <WideTextInput
                labelText={props.translations.textInput}
                className={'name-input'}
                onBlur={(e) =>
                  handleTitleChange(e.target.value, item.uniqueItemId)
                }
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
                disabled={props.disabled}
              />
            </div>
            <div className="col-6">
              <WideTextInput
                labelText={props.versionLabelCaption}
                defaultValue={props.versionLabel ?? '1'}
                onBlur={(e) => props.setVersionLabel(e.target.value)}
              />
            </div>
            <div className="col-12">
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
                disabled={props.disabled}
              />
            </div>
          </div>
        </LanguageBlock>
      ))}
    </>
  );
}
