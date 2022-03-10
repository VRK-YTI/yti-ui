import styled from 'styled-components';
import { Alert, Icon } from 'suomifi-ui-components';


export const AlertToast = styled(Alert)<{isSmall: boolean}>`
  max-width: ${props => props.isSmall ? '300px' : '500px'};
`;

export const Toast = styled.div<{isSmall: boolean}>`
  width: ${props => props.isSmall ? '290px' : '350px'};
  height: 60px;
  border-top: 4px solid ${props => props.theme.suomifi.colors.successBase};
  border-radius: 3px 3px 0px 0px;
  background: ${props => props.theme.suomifi.colors.whiteBase};
  display: flex;
  align-items: center;
  font-size: 16px;
  gap: 10px;
`;

export const ToastIcon = styled(Icon)`
  height: 24px;
  width: 24px;
  margin-left: 15px;
  color: ${props => props.theme.suomifi.colors.successBase};
`;

export const AlertsWrapper = styled.div`
  position: absolute;
  width: 100%;
  margin-top: 10px;
  display: grid;
  justify-content: center;

  > * {
    grid-row: 1;
    grid-column: 1;
  }
`;
