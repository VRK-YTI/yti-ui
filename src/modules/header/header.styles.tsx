import styled from 'styled-components';
import { Button } from 'suomifi-ui-components';
import { LayoutProps } from '../../layouts/layout-props';

export const HeaderWrapper = styled.div<LayoutProps>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 57px;
  gap: 0px;
`;

export const SearchAndLanguageWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

export const SearchWrapper = styled.div<LayoutProps>`
  max-width: 320px;
`;

export const SearchIconButton = styled.div`
  height: 51px;
  width: 51px;

  display: flex;
  align-items: center;
  justify-content: center;
`;

export const SmallSearchButton = styled(Button)`
  flex-shrink: 0;
`;

export const SiteLogo = styled.div<LayoutProps>`
  flex-grow: ${props => props.isSmall ? '1' : '0'};
  line-height: 0;

  a {
    display: block;
    line-height: 0;
  }
`;

export const AuthenticationPanelWrapper = styled.div`
  align-self: center;
`;
