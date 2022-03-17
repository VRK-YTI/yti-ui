import styled from 'styled-components';
import { Alert, Icon } from 'suomifi-ui-components';

export const AlertToast = styled(Alert)<{isSmall: boolean}>`
  max-width: ${props => props.isSmall ? '300px' : '500px'};
`;

export const Toast = styled.div<{isSmall: boolean}>`
  align-items: center;
  background: ${props => props.theme.suomifi.colors.whiteBase};
  border-radius: 3px;
  border-top: 4px solid ${props => props.theme.suomifi.colors.successBase};
  display: flex;
  font-size: 16px;
  gap: 10px;
  height: 60px;
  width: ${props => props.isSmall ? '290px' : '350px'};
`;

export const ToastIcon = styled(Icon)`
  color: ${props => props.theme.suomifi.colors.successBase};
  height: 24px;
  margin-left: 15px;
  width: 24px;
`;

export const AlertsWrapper = styled.div<{scrollY: number, isSmall?: boolean}>`
  position: ${props => props.scrollY > 150 ? 'fixed' : 'absolute'};;
  z-index: ${props => props.scrollY > 150 ? '2' : '1'};
  width: 100%;
  margin-top: ${props => props.scrollY > 150
    ?
    props.isSmall
      ?
      '-50px'
      :
      '-115px'
    :
    '10px'
};
  display: grid;
  justify-content: center;
  > * {
    grid-row: 1;
    grid-column: 1;
  }
`;
