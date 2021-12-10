import styled from 'styled-components';

export const MobileMenuImpersonateSection = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  background-color: ${props => props.theme.suomifi.colors.whiteBase};
`;

export const MobileMenuImpersonateItem = styled.li<{ active?: boolean, inset?: boolean }>`
  height: 44px;
  border-top: 1px solid ${props => props.theme.suomifi.colors.depthSecondary};

  * {
    display: block;
    padding-top: 9px;
    padding-bottom: 8px;
    font-weight: ${props => props.active ? 600 : 400};
    padding-left: ${props => props.inset ? '25px' : '10px'};
    border-left: 5px solid ${props => props.active ? props.theme.suomifi.colors.highlightBase : 'transparent'};
  }

  &:hover a {
    border-left: 5px solid ${props => props.theme.suomifi.colors.highlightBase};
  }
`;
