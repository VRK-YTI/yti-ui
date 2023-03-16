import { useTranslation } from 'next-i18next';
import { ExternalLink, Button, Text } from 'suomifi-ui-components';
import { List, ListItem } from './inline-list.styles';

export interface InlineListProps {
  items: {
    label: string;
    id: string;
  }[];
  handleRemoval: (value: string) => void;
  labelRow?: boolean;
}

export default function InlineList({
  items,
  handleRemoval,
  labelRow,
}: InlineListProps) {
  const { t } = useTranslation('admin');

  if (items.length < 1) {
    return <></>;
  }

  return (
    <List className="inline-list">
      {items.map((item) => (
        <ListItem key={item.id}>
          {labelRow ? (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Text>{item.label}</Text>
              <ExternalLink
                href={item.id}
                labelNewWindow={t('link-opens-new-window-external', {
                  ns: 'common',
                })}
              >
                {item.id}
              </ExternalLink>
            </div>
          ) : (
            <ExternalLink
              href={item.id}
              labelNewWindow={t('link-opens-new-window-external', {
                ns: 'common',
              })}
            >
              {item.label}
            </ExternalLink>
          )}
          <Button
            variant="secondaryNoBorder"
            icon="remove"
            onClick={() => handleRemoval(item.id)}
          >
            {t('remove')}
          </Button>
        </ListItem>
      ))}
    </List>
  );
}
