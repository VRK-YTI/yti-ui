import { useTranslation } from 'next-i18next';
import { ExternalLink, Button, Text } from 'suomifi-ui-components';
import { List, ListItem } from './inline-list.styles';
import { Schema } from '@app/common/interfaces/schema.interface';

export interface InlineListProps {
  items: Schema[];
  handleRemoval: (value: string) => void;
  labelRow?: boolean;
  deleteDisabled: string[] | boolean;
}

export default function InlineList({
  items,
  handleRemoval,
  labelRow,
  deleteDisabled,
}: InlineListProps) {
  const { t } = useTranslation('admin');

  if (items.length < 1) {
    return <></>;
  }

  return (
    <List className="inline-list">
      {items.map((item) => (
        <ListItem key={item.pid}>
          {labelRow ? (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Text>{item.status}</Text>
            </div>
          ) : (
            <ExternalLink
              href={item.pid}
              labelNewWindow={t('link-opens-new-window-external', {
                ns: 'common',
              })}
            >
              {item.label}
            </ExternalLink>
          )}

          {Array.isArray(deleteDisabled) && deleteDisabled.includes(item.id) ? (
            <></>
          ) : (
            <Button
              variant="secondaryNoBorder"
              icon="remove"
              onClick={() => handleRemoval(item.pid)}
            >
              {t('remove')}
            </Button>
          )}
        </ListItem>
      ))}
    </List>
  );
}
