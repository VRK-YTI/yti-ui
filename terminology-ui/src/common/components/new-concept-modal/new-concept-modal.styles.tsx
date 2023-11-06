import { default as styled } from 'styled-components';
import { Block } from 'suomifi-ui-components';

export const TextInputBlock = styled(Block)`
  margin-top: ${(props) => props.theme.suomifi.spacing.l};

  > * {
    margin-top: ${(props) => props.theme.suomifi.spacing.m};
  }
`;
