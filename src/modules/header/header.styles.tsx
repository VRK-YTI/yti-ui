import styled from 'styled-components';
import { LayoutProps } from '../../layouts/layout-props';

export const HeaderWrapper = styled.div<LayoutProps>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 76px;
  gap: ${props => props.isSmall ? '20px': '0px'};
`;

export const SearchAndLanguageWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

export const SearchWrapper = styled.div<LayoutProps>`
  max-width: 320px;
`;

export const SiteLogo = styled.div<LayoutProps>`
  flex-grow: ${props => props.isSmall ? '1' : '0'};
`;

export const AuthenticationPanelWrapper = styled.div`
  align-self: center;
`;
