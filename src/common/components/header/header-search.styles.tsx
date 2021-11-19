import styled from 'styled-components';
import { LayoutProps } from '../../../layouts/layout-props';

export const SearchWrapper = styled.div<LayoutProps>`
  display: flex;
  justify-content: end;
  padding-top: ${props => props.isSmall ? '15px' : '2px'};
`;
