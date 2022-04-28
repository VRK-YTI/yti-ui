import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { Button, Dropdown, DropdownItem } from 'suomifi-ui-components';
import {
  ConceptInfoBlock,
  ConceptInfoBlockWrapper,
  ConceptInfoTextarea,
} from './concept-info-block.styles';

interface ConceptInfoBlockListProps {
  list: any[];
  parent: string;
  update: (object: any) => void;
  remove: (id: number) => void;
}

interface ConceptInfoListItemProps {
  item: number;
}

export default function ConceptInfoBlockList({
  list,
  parent,
  update,
  remove,
}: ConceptInfoBlockListProps) {
  if (list.length < 1) {
    return null;
  }

  return (
    <ConceptInfoBlockWrapper>
      {list.map((item) => {
        console.log(item);
        return <ConceptInfoListItem item={item} key={`${parent}-${item.id}`} />;
      })}
    </ConceptInfoBlockWrapper>
  );

  function ConceptInfoListItem({ item }: ConceptInfoListItemProps) {
    const { t } = useTranslation('admin');
    const [text, setText] = useState(item.value);
    console.log(item);
    return (
      <ConceptInfoBlock>
        <div className="top-row">
          <Dropdown
            labelText={t('language')}
            defaultValue="fi"
            onChange={(e) => update({ id: item.id, lang: e, })}
            value={item.lang}
          >
            <DropdownItem value="fi">{t('fi')}</DropdownItem>
            <DropdownItem value="sv">{t('sv')}</DropdownItem>
            <DropdownItem value="en">{t('en')}</DropdownItem>
          </Dropdown>

          <Button
            variant="secondaryNoBorder"
            icon="remove"
            onClick={() => remove(item.id)}
          >
            {t('remove')}
          </Button>
        </div>

        <ConceptInfoTextarea
          labelText={t(`${parent}-textarea-label-text`)}
          visualPlaceholder={t(`${parent}-textarea-placeholder`)}
          onChange={(e) => setText(e.target.value)}
          onBlur={() => update({ id: item.id, value: text })}
          value={text}
        />
      </ConceptInfoBlock>
    );
  }
}
