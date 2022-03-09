import styled from 'styled-components';
import { Alert } from 'suomifi-ui-components';


export const AlertToast = styled(Alert)<{isSmall: boolean}>`
  max-width: ${props => props.isSmall ? '300px' : '500px'};
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
