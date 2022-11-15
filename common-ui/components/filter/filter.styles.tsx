import styled from "styled-components";
import { Button, RadioButton } from "suomifi-ui-components";

export const CloseWrapper = styled.div`
  * {
    margin-bottom: ${(props) => props.theme.suomifi.spacing.s};
  }
`;

export const DropdownWrapper = styled.div`
  > div {
    width: 100%;
  }
`;

export const FilterRadioButton = styled(RadioButton)`
  font-size: ${(props) => props.theme.suomifi.typography.bodyTextSmall};
`;

export const FilterSection = styled.section<{ $isModal: boolean }>`
  background-color: ${(props) => props.theme.suomifi.colors.whiteBase};
  border: ${(props) =>
    props.$isModal
      ? "none"
      : `solid 1px ${props.theme.suomifi.colors.depthLight1}`};
  height: max-content;
  width: ${(props) => (props.$isModal ? "100%" : "350px")};
  margin-bottom: ${(props) => (props.$isModal ? "0px" : "80px")};
`;

export const Header = styled.div`
  align-items: center;
  background-color: ${(props) => props.theme.suomifi.colors.highlightBase};
  color: ${(props) => props.theme.suomifi.colors.whiteBase};
  display: flex;
  font-size: ${(props) => props.theme.suomifi.typography.bodyText};
  font-weight: 600;
  justify-content: space-between;
  padding: 25px 20px 25px;

  h2 {
    font-size: inherit;
    margin-top: 0;
    margin-bottom: 0;
    text-transform: uppercase;
  }
`;

export const HeaderButton = styled(Button)`
  background: none;
  font-size: 16px;
  font-weight: 400;
  padding: 0px 5px 0px;

  :hover {
    background: none;
  }
`;

export const FilterContent = styled.div`
  margin: 20px;
`;
