import styled from 'styled-components';
import { Icon } from 'suomifi-ui-components';

export const ModalContentWrapper = styled.div`
  > * {
    margin-top: ${(props) => props.theme.suomifi.spacing.m};
  }
`;

export const ModalContentProcessing = styled.div`
  margin: 30px 30px 18px 30px;
  padding: 0;

  #loading-block {
    height: 140px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  #error-block {
    margin: ${(props) => props.theme.suomifi.spacing.xl} 0;
  }

  > div:last-child {
    width: min-content;
    white-space: nowrap;
    display: flex;
    gap: ${(props) => props.theme.suomifi.spacing.s};
  }
`;

export const SuccessIcon = styled(Icon)`
  color: ${(props) => props.theme.suomifi.colors.successBase};
  width: 46px;
  height: 46px;
`;
