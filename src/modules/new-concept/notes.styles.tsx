import styled from 'styled-components';
import { Block, Textarea } from 'suomifi-ui-components';

export const NoteBlock = styled(Block)`
  background: ${(props) => props.theme.suomifi.colors.highlightLight4};
  border: 1px solid ${(props) => props.theme.suomifi.colors.depthLight1};
  margin-bottom: ${props => props.theme.suomifi.spacing.m};
  padding: ${props => props.theme.suomifi.spacing.m};
  width: 800px;

  .top-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
`;

export const NoteTextarea = styled(Textarea)`
  margin-top: ${props => props.theme.suomifi.spacing.m};
  width: 760px;
`;
