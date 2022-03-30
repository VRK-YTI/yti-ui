import styled from 'styled-components';
import { Button } from 'suomifi-ui-components';

export const PaginationWrapper = styled.div`
  display: flex;
  flex-basis: 0;
  width: fit-content;
  border-top: solid 1px ${(props) => props.theme.suomifi.colors.depthLight1};
  border-bottom: solid 1px ${(props) => props.theme.suomifi.colors.depthLight1};
  border-right: solid 1px ${(props) => props.theme.suomifi.colors.depthLight1};
  background: ${(props) => props.theme.suomifi.colors.whiteBase};
  margin-top: ${(props) => props.theme.suomifi.spacing.m};

  > * {
    border-left: solid 1px ${(props) => props.theme.suomifi.colors.depthLight1} !important;
  }
`;

export const ChevronButton = styled(Button)`
  height: 35px;
  width: 35px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;

  > svg {
    line-height: 16px;
    margin-right: 0px !important;
  }
`;

export const PaginationButton = styled(Button)`
  height: 35px;
  width: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${(props) => props.theme.suomifi.typography.bodyTextSmall};
`;

export const PaginationMobile = styled.div`
  height: auto;
  width: auto;
  padding-left: ${(props) => props.theme.suomifi.spacing.m};
  padding-right: ${(props) => props.theme.suomifi.spacing.m};
  border-style: none;
  border-left: solid 1px ${(props) => props.theme.suomifi.colors.depthLight1};
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  font-size: ${(props) => props.theme.suomifi.typography.bodyTextSmall};
  color: ${(props) => props.theme.suomifi.colors.highlightBase};
  background: ${(props) => props.theme.suomifi.colors.whiteBase};
`;
