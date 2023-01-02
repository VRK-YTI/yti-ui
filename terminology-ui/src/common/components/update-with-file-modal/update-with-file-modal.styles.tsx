import styled from 'styled-components';
import { Block, Icon } from 'suomifi-ui-components';

export const ModalContentWrapper = styled.div`
  margin: 30px 30px 18px 30px;
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;

  #loading-block {
    height: 140px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  #error-block {
    margin: 0 0 ${(props) => props.theme.suomifi.spacing.xl} 0;
  }

  > div:last-child {
    display: flex;
    flex-direction: row;
    gap: ${(props) => props.theme.suomifi.spacing.s};
  }
`;

export const SuccessIcon = styled(Icon)`
  color: ${(props) => props.theme.suomifi.colors.successBase};
  width: 46px;
  height: 46px;
`;

export const UpdateDescriptionBlock = styled(Block)`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
