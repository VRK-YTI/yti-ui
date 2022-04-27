import styled from 'styled-components';
import { Textarea } from 'suomifi-ui-components';

export const ConceptInfoBlock = styled.li`
  background: ${(props) => props.theme.suomifi.colors.highlightLight4};
  border: 1px solid ${(props) => props.theme.suomifi.colors.depthLight1};
  margin-bottom: ${(props) => props.theme.suomifi.spacing.m};
  padding: ${(props) => props.theme.suomifi.spacing.m};
  width: 800px;

  .top-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
`;

export const ConceptInfoBlockWrapper = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

export const ConceptInfoTextarea = styled(Textarea)`
  margin-top: ${(props) => props.theme.suomifi.spacing.m};
  width: 760px;
`;
