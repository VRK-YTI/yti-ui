import styled from 'styled-components';
import { LayoutProps } from '../layout/layout-props';

export const ButtonsDiv = styled.div<LayoutProps>`
  display: flex;
  justify-content: end;
  padding-top: 10px;
  flex-direction: ${props => props.isLarge ? 'row' : 'column'};
  gap: 5px;
`;

export const UserInfo = styled.div`
  span {
    font-size: 14px;
    display: inline-block;
    margin-top: 10px;
    padding-right: 10px;
  }
`;
