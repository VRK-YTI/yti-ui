import styled from 'styled-components';
import { Label } from 'suomifi-ui-components';
import InlineList from '../inline-list';

const InlineListBlockWrapper = styled.div`
  .fi-label,
  .inline-list {
    margin-bottom: ${(props) => props.theme.suomifi.spacing.xs};
  }
  margin-bottom: ${(props) => props.theme.suomifi.spacing.s};
`;

interface InlineListBlockProps {
  label: string;
  optionalText?: string;
  items: {
    id: string;
    label: string;
  }[];
  addNewComponent: React.ReactElement;
  labelRow?: boolean;
  deleteDisabled?: string[] | boolean;
  handleRemoval: (id: string) => void;
}

export default function InlineListBlock({
  label,
  optionalText,
  items,
  addNewComponent,
  labelRow,
  deleteDisabled = false,
  handleRemoval,
}: InlineListBlockProps) {
  return (
    <InlineListBlockWrapper>
      <Label optionalText={optionalText}>{label}</Label>
      <InlineList
        labelRow={labelRow}
        handleRemoval={handleRemoval}
        items={items}
        deleteDisabled={deleteDisabled}
      />
      {addNewComponent}
    </InlineListBlockWrapper>
  );
}
