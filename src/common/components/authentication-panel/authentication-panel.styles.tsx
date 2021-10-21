import styled from 'styled-components';
import { LayoutProps } from '../layout/layout-props';

export const ButtonsDiv = styled.div<LayoutProps>`
  display: flex;
  justify-content: space-around;
  padding-top: 10px;
  flex-direction: ${props => props.isLarge ? 'row' : 'column'};
  row-gap: 5px;
`;

export const UserInfo = styled.div`
  span {
    font-size: 14px;
    display: block;
  }
`