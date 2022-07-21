import { BasicBlock } from '@app/common/components/block';
import { BasicBlockExtraWrapper } from '@app/common/components/block/block.styles';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { Button } from 'suomifi-ui-components';
import {
  ListBlockWrapper,
  ListItem as LI,
  ListItemTextarea,
} from './list-block.styles';
import { v4 } from 'uuid';
import {
  ConceptTermType,
  ItemType,
} from '../concept-terms-block/concept-term-block-types';
import { BasicInfoType } from '../basic-information/concept-basic-information-types';

interface ListBlockProps {
  update: (
    key: keyof ConceptTermType | keyof BasicInfoType['orgInfo'],
    value?: string | ItemType[] | null
  ) => void;
  items: ItemType[];
  itemsKey: keyof ConceptTermType;
  noLangOption?: boolean;
}

export default function ListBlock({
  update,
  items,
  itemsKey,
  noLangOption,
}: ListBlockProps) {
  const { t } = useTranslation('admin');
  const [list, setList] = useState<ItemType[]>(
    items
      ? items.map((note) => ({
          id: note.id,
          lang: note.lang ? note.lang : '',
          value: note.value ?? '',
        }))
      : []
  );

  const handleAddition = () => {
    const updatedList = [
      ...list,
      {
        id: v4(),
        lang: '',
        value: '',
      },
    ];
    setList(updatedList);
    update(itemsKey, updatedList);
  };

  const handleRemove = (id: string) => {
    const updatedList = list.filter((item) => item.id !== id);
    setList(updatedList);
    update(itemsKey, updatedList);
  };

  const handleUpdate = (id: string, value: any) => {
    const updatedList = list.map((item) => {
      if (item.id === id) {
        return {
          id: item.id,
          lang: value.lang ? value.lang : '',
          value: value,
        };
      }
      return item;
    });

    setList(updatedList);
    update(itemsKey, updatedList);
  };

  return (
    <BasicBlock
      largeWidth
      title={t('admin-note')}
      extra={
        <BasicBlockExtraWrapper>
          <ListBlockWrapper>
            {list.map((item) => (
              <ListItem
                key={item.id}
                item={item}
                itemsKey={itemsKey}
                handleRemove={handleRemove}
                handleUpdate={handleUpdate}
                noLangOption={noLangOption ? true : false}
              />
            ))}
          </ListBlockWrapper>
          <Button variant="secondary" onClick={() => handleAddition()}>
            {t('add-new-admin-note')}
          </Button>
        </BasicBlockExtraWrapper>
      }
    >
      {t(`${itemsKey}-description`)}
    </BasicBlock>
  );
}

interface ListItemProps {
  item: ItemType;
  itemsKey: string;
  handleRemove: (id: string) => void;
  handleUpdate: (id: string, value: any) => void;
  noLangOption: boolean;
}

function ListItem({
  item,
  handleRemove,
  handleUpdate,
  noLangOption,
  itemsKey,
}: ListItemProps) {
  const { t } = useTranslation('admin');

  if (noLangOption) {
    return (
      <LI>
        <div className="top-row">
          <ListItemTextarea
            labelText={t(`${itemsKey}-textarea-label-text`)}
            visualPlaceholder={t(`${itemsKey}-textarea-placeholder`)}
            defaultValue={item.value}
            $noTopMargin
            onBlur={(e) => handleUpdate(item.id, e.target.value)}
          />
          <Button
            variant="secondaryNoBorder"
            icon="remove"
            onClick={() => handleRemove(item.id)}
          >
            {t('remove')}
          </Button>
        </div>
      </LI>
    );
  }

  return <></>;
}
