import styled from 'styled-components';

export const FormWrapper = styled.div`
  > div {
    margin-bottom: ${(props) => props.theme.suomifi.spacing.m};
  }

  .wide-text {
    width: 100%;
  }
`;
