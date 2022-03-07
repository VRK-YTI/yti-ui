import styled from "styled-components";

export const InfoBasicWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: ${(props) => props.theme.suomifi.spacing.l};
  max-width: 695px;
`;

export const InfoBasicExtraWrapper = styled.div`
  margin-top: ${(props) => props.theme.suomifi.spacing.m};
`;
