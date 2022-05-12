import styled from 'styled-components';
import { Block } from 'suomifi-ui-components';

export const FooterBlock = styled(Block)`
  div {
    display: flex;
    gap: ${(props) => props.theme.suomifi.spacing.s};
  }
`;

export const NewConceptBlock = styled(Block)`
  background: white;
  border: 1px solid ${(props) => props.theme.suomifi.colors.depthDark3};
  margin-bottom: 80px;
  margin-top: ${(props) => props.theme.suomifi.spacing.m};
  padding: 30px 80px 20px 80px;
`;
