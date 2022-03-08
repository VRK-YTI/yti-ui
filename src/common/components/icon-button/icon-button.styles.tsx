import styled from 'styled-components';
import { Button } from 'suomifi-ui-components';

export const StyledButton = styled(Button)<{ color?: string }>`
  width: 44px;
  height: 44px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    color: ${(props) => props.color ?? props.theme.suomifi.colors.blackBase};
    height: 24px;
    width: 24px;
  }
`;
