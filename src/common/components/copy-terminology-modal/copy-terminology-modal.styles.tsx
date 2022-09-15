import styled from 'styled-components';
import { Block } from 'suomifi-ui-components';

export const FooterBlock = styled(Block)`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.suomifi.spacing.s};
`;
