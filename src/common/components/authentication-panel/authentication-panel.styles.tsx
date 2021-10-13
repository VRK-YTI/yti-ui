import styled from 'styled-components';
import { LayoutProps } from '../layout/layout-props';

export const ButtonsDiv = styled.div<LayoutProps>`
  display: flex;
  justify-content: end;
  padding-top: 10px;
  flex-direction: ${props => props.isSmall ? 'column' : 'row'};
  gap: 5px;
`;

export const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  span {
    font-size: 14px;
  }
`;
