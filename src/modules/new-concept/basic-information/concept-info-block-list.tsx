import { useTranslation } from 'next-i18next';
import { Button, Dropdown, DropdownItem } from 'suomifi-ui-components';
import {
  ConceptInfoBlock,
  ConceptInfoBlockWrapper,
  ConceptInfoTextarea,
} from './concept-info-block.styles';

interface ConceptInfoBlockListProps {
  list: any[];
  parent: string;
  setList: (id: number) => void;
}

interface ConceptInfoListItemProps {
  id: number;
}

export default function ConceptInfoBlockList({
  list,
  parent,
  setList,
}: ConceptInfoBlockListProps) {
  if (list.length < 1) {
    return null;
  }

  return (
    <ConceptInfoBlockWrapper>
      {list.map((i) => {
        return <ConceptInfoListItem id={i} key={`${parent}-${i}`} />;
      })}
    </ConceptInfoBlockWrapper>
  );

  function ConceptInfoListItem({ id }: ConceptInfoListItemProps) {
    const { t } = useTranslation('admin');

    return (
      <ConceptInfoBlock>
        <div className="top-row">
          <Dropdown labelText={t('language')} defaultValue="fi">
            <DropdownItem value="fi">{t('fi')}</DropdownItem>
            <DropdownItem value="sv">{t('sv')}</DropdownItem>
            <DropdownItem value="en">{t('en')}</DropdownItem>
          </Dropdown>

          <Button
            variant="secondaryNoBorder"
            icon="remove"
            onClick={() => setList(id)}
          >
            {t('remove')}
          </Button>
        </div>

        <ConceptInfoTextarea
          labelText={t(`${parent}-textarea-label-text`)}
          visualPlaceholder={t(`${parent}-textarea-placeholder`)}
        />
      </ConceptInfoBlock>
    );
  }
}
