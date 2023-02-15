import { ExternalLink, Button } from 'suomifi-ui-components';
import { List, ListItem } from './inline-list.styles';

export interface InlineListProps {
  items: {
    label: string;
    id: string;
  }[];
  handleRemoval: (value: string) => void;
}

export default function InlineList({ items, handleRemoval }: InlineListProps) {
  if (items.length < 1) {
    return <></>;
  }

  return (
    <List>
      {items.map((item) => (
        <ListItem key={item.id}>
          <ExternalLink href="" labelNewWindow="">
            {item.label}
          </ExternalLink>
          <Button
            variant="secondaryNoBorder"
            icon="remove"
            onClick={() => handleRemoval(item.id)}
          >
            Poista
          </Button>
        </ListItem>
      ))}
    </List>
  );
}
