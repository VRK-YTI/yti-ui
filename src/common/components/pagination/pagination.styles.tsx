import styled from 'styled-components';
import { Button } from 'suomifi-ui-components';

export const PaginationButton = styled(Button)`
  height: 30px;
  width: 30px;
  margin: 0px;
  padding 0px;
  border-left: solid 2px ${props => props.theme.suomifi.colors.depthLight1};
  background: ${props => props.variant === 'default'} ? ${props => props.theme.suomifi.colors.highlightDark1} : ${props => props.theme.suomifi.colors.whiteBase};
  color: ${props => props.variant === 'default'} ? ${props => props.theme.suomifi.colors.whiteBase} : ${props => props.theme.suomifi.colors.highlightDark1};
  
`;
