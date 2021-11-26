import styled from 'styled-components';
import { LayoutProps } from '../../../layouts/layout-props';

export const FooterContentWrapper = styled.div`
  padding: 20px 0px;
  border-bottom: ${(props) => `1px solid ${props.theme.suomifi.colors.depthLight1}`};
  span {
    display: inline-block;
    padding-top: 10px;
  }
`;

export const FooterLinkWrapper = styled.div<LayoutProps>`
  display: flex;
  padding: 20px 0;
  column-gap: 40px;
  row-gap: 18px;
  justify-content: flex-start;
  flex-wrap: wrap;
  flex-direction: ${props => props.isSmall ? 'column' : 'row'};
`;
