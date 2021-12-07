import styled from 'styled-components';
import { Breakpoint } from '../media-query/media-query-context';
import { small } from '../media-query/styled-helpers';

export const FooterContentWrapper = styled.div`
  padding: 20px 0px;
  border-bottom: ${(props) => `1px solid ${props.theme.suomifi.colors.depthLight1}`};
  span {
    display: inline-block;
    padding-top: 10px;
  }
`;

export const FooterLinkWrapper = styled.div<{ breakpoint: Breakpoint }>`
  display: flex;
  padding: 20px 0;
  column-gap: 40px;
  row-gap: 18px;
  justify-content: flex-start;
  flex-wrap: wrap;
  flex-direction: ${props => small(props.breakpoint, 'column', 'row')};
`;
