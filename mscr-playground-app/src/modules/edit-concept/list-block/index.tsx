import { BasicBlock, BasicBlockExtraWrapper } from 'yti-common-ui/block';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { Button, Dropdown, DropdownItem } from 'suomifi-ui-components';
import {
  ListBlockWrapper,
  ListItem as LI,
  ListItemTextarea,
} from './list-block.styles';
import { v4 } from 'uuid';
import { ListType } from '../new-concept.types';
import { TermFormUpdate } from '../concept-terms-block/term-form';
import { BasicInfoUpdate } from '../basic-information/concept-basic-information';
import { translateLanguage } from '@app/common/utils/translation-helpers';
import { TEXT_AREA_MAX } from 'yti-common-ui/utils/constants';
import { FormError } from '../validate-form';
import { useBreakpoints } from 'yti-common-ui/media-query';

interface ListBlockProps {
  update: (object: BasicInfoUpdate & TermFormUpdate) => void;
  items?: ListType[];
  itemsKey: 'editorialNote' | 'example' | 'note' | 'source';
  languages?: string[];
  noLangOption?: boolean;
  title: string;
  description?: string;
  addNewText: string;
  inputLabel: string;
  inputPlaceholder: string;
  errors?: FormError;
}

export default function ListBlock({
  update,
  items,
  itemsKey,
  languages,
  noLangOption,
  title,
  description,
  addNewText,
  inputLabel,
  inputPlaceholder,
  errors,
}: ListBlockProps) {
  const [list, setList] = useState<ListType[]>(
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
        lang: !noLangOption && languages ? languages[0] : '',
        value: '',
      },
    ];
    setList(updatedList);
    update({ key: itemsKey, value: updatedList });
  };

  const handleRemove = (id: string) => {
    const updatedList = list.filter((item) => item.id !== id);
    setList(updatedList);
    update({ key: itemsKey, value: updatedList });
  };

  const handleUpdate = (id: string, value: string, lang?: string) => {
    const updatedList = list.map((item) => {
      if (item.id === id) {
        return {
          id: item.id,
          lang: lang ? lang : '',
          value: value.trim(),
        };
      }
      return item;
    });

    setList(updatedList);
    update({ key: itemsKey, value: updatedList });
  };

  return (
    <BasicBlock
      largeWidth
      title={title}
      extra={
        <BasicBlockExtraWrapper>
          <ListBlockWrapper className="list-block">
            {list.map((item) => (
              <ListItem
                key={item.id}
                item={item}
                itemsKey={itemsKey}
                handleRemove={handleRemove}
                handleUpdate={handleUpdate}
                languages={languages}
                noLangOption={noLangOption ? true : false}
                inputLabel={inputLabel}
                inputPlaceholder={inputPlaceholder}
                error={errors?.[itemsKey]}
              />
            ))}
          </ListBlockWrapper>
          <Button variant="secondary" onClick={() => handleAddition()}>
            {addNewText}
          </Button>
        </BasicBlockExtraWrapper>
      }
    >
      {description}
    </BasicBlock>
  );
}

interface ListItemProps {
  item: ListType;
  itemsKey: string;
  handleRemove: (id: string) => void;
  handleUpdate: (id: string, value: string, lang?: string) => void;
  languages?: string[];
  noLangOption: boolean;
  inputLabel: string;
  inputPlaceholder: string;
  error?: boolean;
}

function ListItem({
  item,
  handleRemove,
  handleUpdate,
  languages,
  noLangOption,
  itemsKey,
  inputLabel,
  inputPlaceholder,
  error,
}: ListItemProps) {
  const { t } = useTranslation('admin');
  const { isSmall } = useBreakpoints();
  const [text, setText] = useState(item.value);

  const handleBlur = (id: string, text: string, lang?: string) => {
    setText(text);
    handleUpdate(id, text, lang);
  };

  if (!noLangOption && languages && languages.length > 0) {
    return (
      <LI $isSmall={isSmall}>
        <Dropdown
          labelText={t('language')}
          defaultValue={item.lang}
          onChange={(e) => handleUpdate(item.id, item.value, e)}
        >
          {languages?.map((language, idx) => (
            <DropdownItem key={`${itemsKey}-list-item-${idx}`} value={language}>
              {translateLanguage(language, t)}
            </DropdownItem>
          ))}
        </Dropdown>
        <ListItemTextarea
          labelText={inputLabel}
          visualPlaceholder={inputPlaceholder}
          defaultValue={item.value}
          onBlur={(e) => handleBlur(item.id, e.target.value, item.lang)}
          maxLength={TEXT_AREA_MAX}
          status={error && text === '' ? 'error' : 'default'}
          $isSmall={isSmall}
        />
        <div className="button-block">
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

  if (noLangOption) {
    return (
      <LI $isSmall={isSmall} $sameLevel>
        <ListItemTextarea
          labelText={inputLabel}
          visualPlaceholder={inputPlaceholder}
          defaultValue={item.value}
          $noTopMargin
          onBlur={(e) => handleBlur(item.id, e.target.value, '')}
          maxLength={TEXT_AREA_MAX}
          status={error && text === '' ? 'error' : 'default'}
        />
        <div className="button-block">
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
