import styled from 'styled-components';
import { LayoutProps } from '../layout/layout-props';
import { Text } from 'suomifi-ui-components';

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
  padding-top: ${props => props.isSmall ? '15px' : '2px'};
`;

export const SiteLogo = styled.div`
  margin-top: 5px;
`;

export const SmallSearchWrapper = styled.div`
  display: flex;
  flex-row: row;}
`;

export const SmallSearchText = styled(Text)`
  padding-top: 15px;
  padding-left: 20px;
`;
