import styled from "styled-components";
import { Heading } from "suomifi-ui-components";
import { DebugProps } from "../../interfaces/debug-props";

export const HeaderWrapper = styled.div<DebugProps>`
  display: flex;
  justify-content: space-between;
  padding-top: 10px;
`
export const SiteLogo = styled.div<DebugProps>`
  font-weight: bold;
  ${(props) => (props.debug === true ? 'border: 4px solid red' : '')};
`;

export const HeaderTitle = styled(({ children }) => (
  <Heading variant="h4">{ children }</Heading>)
)`
  color: ${(props) => props.theme.suomifi.colors.highlightBase};
  &:hover {
    color: red;
  }
`;
