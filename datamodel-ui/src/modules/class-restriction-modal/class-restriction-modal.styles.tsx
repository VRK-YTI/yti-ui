import styled from 'styled-components';

export const ModalContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.suomifi.spacing.m};
  margin-top: ${(props) => props.theme.suomifi.spacing.m};

  .block-label {
    font-size: 22px;
  }
`;
