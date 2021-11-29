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

`;

export const PaginationButton = styled.div<PaginationButtonProps>`
  height: 35px;
  width: 35px;
  border-style: none;
  border-left: solid 1px ${props => props.theme.suomifi.colors.depthLight1};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: ${props => props.active ? props.theme.suomifi.colors.whiteBase : props.theme.suomifi.colors.highlightBase};
  background: ${props => props.active ? props.theme.suomifi.colors.highlightDark1 : props.theme.suomifi.colors.whiteBase};

  :hover {
    background: ${props => props.active ? props.theme.suomifi.colors.highlightBase : !props.disabled ? props.theme.suomifi.colors.depthLight2 : ''};
    cursor: ${props => props.disabled ? '' : 'pointer'};
  }

`;
