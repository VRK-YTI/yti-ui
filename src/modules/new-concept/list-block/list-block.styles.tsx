import styled from 'styled-components';
import { Textarea } from 'suomifi-ui-components';

export const ListBlockWrapper = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

export const ListItem = styled.li`
  background: ${(props) => props.theme.suomifi.colors.highlightLight4};
  border: 1px solid ${(props) => props.theme.suomifi.colors.depthLight1};
  margin-bottom: ${(props) => props.theme.suomifi.spacing.m};
  padding: ${(props) => props.theme.suomifi.spacing.m};
  min-width: 475px;

  .top-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: ${(props) => props.theme.suomifi.spacing.m};
  }
`;

export const ListItemTextarea = styled(Textarea)<{ $noTopMargin?: boolean }>`
  margin-top: ${(props) =>
    props.$noTopMargin ? '' : props.theme.suomifi.spacing.m};
  width: 760px;

  textarea {
    min-height: 88px;
  }
`;
