import styled from 'styled-components';
import { Button } from 'suomifi-ui-components';

export const StyledButton = styled(Button)<{
  color?: string;
  isLarge?: boolean;
}>`
  width: ${(props) => (props.isLarge ? '44px' : '40px')};
  height: ${(props) => (props.isLarge ? '44px' : '40px')};
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    color: ${(props) => props.color ?? props.theme.suomifi.colors.blackBase};
    height: ${(props) => (props.isLarge ? '24px' : '16px')};
    width: ${(props) => (props.isLarge ? '24px' : '16px')};
  }
`;
