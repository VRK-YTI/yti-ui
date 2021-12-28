import styled from 'styled-components';
import { PaginationButtonProps } from './pagination-props';

export const PaginationWrapper = styled.div`
  display: flex;
  flex-basis: 0;
  width: fit-content;
  border-top: solid 1px ${props => props.theme.suomifi.colors.depthLight1};
  border-bottom: solid 1px ${props => props.theme.suomifi.colors.depthLight1};
  border-right: solid 1px ${props => props.theme.suomifi.colors.depthLight1};
  background: ${props => props.theme.suomifi.colors.whiteBase};
  margin-top: 20px;
`;

export const PaginationButton = styled.div<PaginationButtonProps>`
  height: 35px;
  width: 35px;
  border-style: none;
  border-left: solid 1px ${props => props.theme.suomifi.colors.depthLight1};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${props => props.theme.suomifi.values.typography.bodyTextSmall.fontSize.value}px;
  color: ${props => props.active ? props.theme.suomifi.colors.whiteBase : props.theme.suomifi.colors.highlightBase};
  background: ${props => props.active ? props.theme.suomifi.colors.highlightDark1 : props.theme.suomifi.colors.whiteBase};

  :hover {
    background: ${props => props.active ? props.theme.suomifi.colors.highlightBase : !props.disabled ? props.theme.suomifi.colors.depthLight2 : ''};
    cursor: ${props => props.disabled ? '' : 'pointer'};
  }
`;

export const PaginationMobile = styled.div`
  height: 35px;
  width: auto;
  padding-left: 20px;
  padding-right: 20px;
  border-style: none;
  border-left: solid 1px ${props => props.theme.suomifi.colors.depthLight1};
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  font-size: ${props => props.theme.suomifi.values.typography.bodyTextSmall.fontSize.value}px;
  color: ${props => props.theme.suomifi.colors.highlightBase};
  background: ${props => props.theme.suomifi.colors.whiteBase};
`;
