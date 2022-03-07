import styled from "styled-components";
import { Alert } from "suomifi-ui-components";

export const AlertToast = styled(Alert)<{ isSmall: boolean }>`
  max-width: ${(props) => (props.isSmall ? "300px" : "500px")};
  margin-left: calc(50% - ${(props) => (props.isSmall ? "150px" : "250px")});
  margin-right: auto;
  position: absolute;
`;

export const AlertsWrapper = styled.div`
  position: absolute;
  width: 100%;
  margin-top: 10px;
`;
