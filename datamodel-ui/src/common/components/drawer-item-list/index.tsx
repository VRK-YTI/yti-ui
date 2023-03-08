import styled from 'styled-components';

const ListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.suomifi.spacing.m};
`;

const ListItem = styled.div`
  font-size: ${(props) => props.theme.suomifi.typography.bodyTextSmall};

  div:first-child {
    font-weight: 600;
    margin-bottom: 5px;
  }
`;

interface DrawerItemListProps {
  items?: {
    label: string;
    subtitle: string;
  }[];
}

export default function DrawerItemList({ items }: DrawerItemListProps) {
  if (!items || items.length < 1) {
    return <></>;
  }

  return (
    <ListWrapper>
      {items.map((item) => (
        <ListItem key={`modal-list-item-${item.subtitle}`}>
          <div>{item.label}</div>
          <div>{item.subtitle}</div>
        </ListItem>
      ))}
    </ListWrapper>
  );
}
