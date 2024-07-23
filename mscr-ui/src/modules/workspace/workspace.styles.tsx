import styled from 'styled-components';
import { Block } from 'suomifi-ui-components';

export const ButtonBlock = styled(Block)`
  display: flex;
  gap: 20px;
  margin-top: ${(props) => props.theme.suomifi.spacing.m};
`;
