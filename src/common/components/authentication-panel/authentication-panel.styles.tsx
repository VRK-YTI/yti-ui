import styled from 'styled-components';
import { LayoutProps } from '../../../layouts/layout-props';

export const ButtonsDiv = styled.div<LayoutProps>`
  display: flex;
  justify-content: end;
  flex-direction: ${props => props.isSmall ? 'column' : 'row'};
  gap: 5px;
`;

export const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 2px;

  span {
    font-size: 16px;
    line-height: 21px;
    font-weight: 600;
    text-align: right;
  }

  span:not(:first-child), a {
    font-size: 12px;
    line-height: 15px;
  }
`;
