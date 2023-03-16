import styled from 'styled-components';
import { Label } from 'suomifi-ui-components';
import InlineList from '../inline-list';

const InlineListBlockWrapper = styled.div`
  .fi-label,
  .inline-list {
    margin-bottom: ${(props) => props.theme.suomifi.spacing.xs};
  }
`;

interface InlineListBlockProps {
  label: string;
  items: {
    id: string;
    label: string;
  }[];
  button: React.ReactElement;
}

export default function InlineListBlock({
  label,
  items,
  button,
}: InlineListBlockProps) {
  return (
    <InlineListBlockWrapper>
      <Label>{label}</Label>
      <InlineList handleRemoval={() => null} items={items} />
      {button}
    </InlineListBlockWrapper>
  );
}
