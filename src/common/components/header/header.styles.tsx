import styled from 'styled-components';
import { LayoutProps } from '../layout/layout-props';

export const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: 10px;
`;

export const LanguageMenuWrapper = styled.div`
  padding-top: 8px;
`;

export const SearchWrapper = styled.div<LayoutProps>`
  display: flex;
  justify-content: end;
  padding-top: ${props => props.isLarge ? '2px' : '15px'};
`;
