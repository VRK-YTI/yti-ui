import styled from 'styled-components';

export const MobileMenuLanguageSection = styled.ul`
  list-style: none;
  margin: 0;
  padding: 12.5px 0;
  background-color: ${props => props.theme.suomifi.colors.depthSecondary};
`;

export const MobileMenuLanguageItem = styled.li<{ active?: boolean }>`
  padding: 7.5px 15px;

  * {
    display: block;
    font-size: 16px;
    line-height: 24px;
    font-weight: ${props => props.active ? '600' : '400'};
  }
`;
