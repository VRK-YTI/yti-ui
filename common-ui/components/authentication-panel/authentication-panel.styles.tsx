import styled from "styled-components";
import { Breakpoint } from "../media-query";
import { small } from "../media-query/styled-helpers";

export const DesktopAuthenticationPanelWrapper = styled.div`
  flex-shrink: 0;
`;

export const ButtonsDiv = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: end;
  flex-direction: row;
  gap: ${(props) => props.theme.suomifi.spacing.xxs};
`;

export const UserInfoWrapper = styled.div<{ $breakpoint: Breakpoint }>`
  display: flex;
  flex-direction: ${(props) => small(props.$breakpoint, "row", "column")};
  justify-content: space-between;
  row-gap: ${(props) => props.theme.suomifi.spacing.insetXxs};
  height: ${(props) => small(props.$breakpoint, "44px", "auto")};
  align-items: ${(props) => small(props.$breakpoint, "baseline", "normal")};

  span {
    font-size: ${(props) => props.theme.suomifi.typography.bodyTextSmall};
    line-height: 21px;
    font-weight: 600;
    text-align: right;
  }

  a {
    font-size: 12px;
    line-height: 15px;
    font-weight: 600;
    text-transform: uppercase;
    padding-block: ${(props) => small(props.$breakpoint, "14px", "0")};
  }
`;

export const LoginButtonsWrapper = styled.div<{ $breakpoint: Breakpoint }>`
  display: flex;
  flex-direction: ${(props) => small(props.$breakpoint, "column", "row")};
  gap: ${(props) => props.theme.suomifi.spacing.xxs};

  padding: ${(props) => small(props.$breakpoint, "15px", "0")};
  border-bottom: ${(props) => small(props.$breakpoint, "1px", "0")} solid
    ${(props) => props.theme.suomifi.colors.depthSecondary};
`;
