import { BasicBlock } from '@app/common/components/block';
import { BasicBlockExtraWrapper } from '@app/common/components/block/block.styles';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { Button, Dropdown, DropdownItem } from 'suomifi-ui-components';
import { BasicInfo, BasicInfoUpdate } from './concept-basic-information-types';
import {
  ConceptInfoBlockListItem,
  ConceptInfoBlockWrapper,
  ConceptInfoTextarea,
} from './concept-info-block.styles';

interface ConceptInfoBlockProps {
  infoKey: string;
  update: (object: BasicInfoUpdate) => void;
  noLangOption?: boolean;
}

interface ConceptInfoListItemProps {
  item: BasicInfo;
  infoKey: string;
  handleUpdate: (value: BasicInfo) => void;
  handleRemove: (id: string) => void;
  noLangOption?: boolean;
}

export default function ConceptInfoBlock({
  infoKey,
  update,
  noLangOption = false,
}: ConceptInfoBlockProps) {
  const { t } = useTranslation('admin');
  const [list, setList] = useState<BasicInfo[]>([]);
  const [id, setId] = useState('0');

  const handleUpdate = ({ id, lang, value }: BasicInfo) => {
    const updatedList = list.map((item) => {
      if (item.id === id) {
        return {
          id: item.id,
          lang: lang ? lang : item.lang,
          value: value,
        };
      }
      return item;
    });

    setList(updatedList);
    update({ key: infoKey, value: updatedList });
  };

  const handleRemove = (id: string) => {
    const updatedList = list.filter((item) => item.id !== id);
    setList(updatedList);
    update({ key: infoKey, value: updatedList });
  };

  const handleAdd = () => {
    const updatedList = [...list, { id: id, lang: 'fi', value: '' }];
    setList(updatedList);
    update({ key: infoKey, value: updatedList });
    setId(id + 1);
  };

  return (
    <BasicBlock
      largeWidth
      title={t(infoKey)}
      extra={
        <BasicBlockExtraWrapper>
          <ConceptInfoBlockWrapper>
            {list.map((item) => {
              return (
                <ConceptInfoListItem
                  item={item}
                  infoKey={infoKey}
                  handleUpdate={handleUpdate}
                  handleRemove={handleRemove}
                  key={`${infoKey}-${item.id}`}
                  noLangOption={noLangOption}
                />
              );
            })}
          </ConceptInfoBlockWrapper>
          <Button variant="secondary" onClick={() => handleAdd()}>
            {t(`add-new-${infoKey}`)}
          </Button>
        </BasicBlockExtraWrapper>
      }
    >
      {t(`${infoKey}-description`)}
    </BasicBlock>
  );
}

function ConceptInfoListItem({
  item,
  infoKey,
  handleUpdate,
  handleRemove,
  noLangOption,
}: ConceptInfoListItemProps) {
  const { t } = useTranslation('admin');
  const [text, setText] = useState(item.value);

  if (noLangOption) {
    return (
      <ConceptInfoBlockListItem>
        <div className="top-row">
          <ConceptInfoTextarea
            labelText={t(`${infoKey}-textarea-label-text`)}
            visualPlaceholder={t(`${infoKey}-textarea-placeholder`)}
            onChange={(e) => setText(e.target.value)}
            onBlur={() => handleUpdate({ id: item.id, value: text })}
            value={text}
            $noTopMargin
          />

          <Button
            variant="secondaryNoBorder"
            icon="remove"
            onClick={() => handleRemove(item.id)}
          >
            {t('remove')}
          </Button>
        </div>
      </ConceptInfoBlockListItem>
    );
  }

  return (
    <ConceptInfoBlockListItem>
      <div className="top-row">
        <Dropdown
          labelText={t('language')}
          defaultValue="fi"
          onChange={(e) => handleUpdate({ id: item.id, lang: e, value: text })}
          value={item.lang}
        >
          <DropdownItem value="fi">{t('fi')}</DropdownItem>
          <DropdownItem value="sv">{t('sv')}</DropdownItem>
          <DropdownItem value="en">{t('en')}</DropdownItem>
        </Dropdown>
        <Button
          variant="secondaryNoBorder"
          icon="remove"
          onClick={() => handleRemove(item.id)}
        >
          {t('remove')}
        </Button>
      </div>

      <ConceptInfoTextarea
        labelText={t(`${infoKey}-textarea-label-text`)}
        visualPlaceholder={t(`${infoKey}-textarea-placeholder`)}
        onChange={(e) => setText(e.target.value)}
        onBlur={(e) => handleUpdate({ id: item.id, value: text })}
        value={text}
      />
    </ConceptInfoBlockListItem>
  );
}
