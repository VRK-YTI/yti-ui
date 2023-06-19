import styled from 'styled-components';

const ListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.suomifi.spacing.m};
`;

const ListItem = styled.div`
  font-size: ${(props) => props.theme.suomifi.typography.bodyTextSmall};

  &:hover {
    background-color: ${(props) => props.theme.suomifi.colors.highlightBase};
    color: ${(props) => props.theme.suomifi.colors.whiteBase};
    border-radius: 2px;
    cursor: pointer;
  }

  padding: 5px;
  margin: 0 -5px;

  div:first-child {
    font-weight: 600;
    margin-bottom: 5px;
  }
`;

interface DrawerItem {
  label: string | React.ReactElement;
  subtitle: string;
  onClick: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

interface DrawerItemListProps {
  items?: DrawerItem[];
}

export default function DrawerItemList({ items }: DrawerItemListProps) {
  if (!items) {
    return <></>;
  }

  return (
    <ListWrapper>
      {items.map((item) => (
        <ListItem
          onClick={() => item.onClick()}
          onMouseEnter={() => item.onMouseEnter && item.onMouseEnter()}
          onMouseLeave={() => item.onMouseLeave && item.onMouseLeave()}
          key={`modal-list-item-${item.subtitle}`}
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && item.onClick()}
        >
          <div>{item.label}</div>
          <div>{item.subtitle}</div>
        </ListItem>
      ))}
    </ListWrapper>
  );
}
