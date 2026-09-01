import styled from 'styled-components';
import { Label } from 'suomifi-ui-components';

export const DesktopLocaleChooserWrapper = styled.div<{ $noFlex?: boolean }>`
  ${(props) =>
    !props.$noFlex &&
    `
  flex-grow: 1;
  `}
  flex-shrink: 0;
  margin-right: 10px;
`;

export const LanguageMenuLabel = styled(Label)`
  margin-top: -1px;
  margin-bottom: 7px;
`;

export const MobileMenuLanguageSection = styled.ul`
  list-style: none;
  margin: 0;
  padding: 12.5px 0;
  background-color: ${(props) => props.theme.suomifi.colors.depthSecondary};
`;

export const MobileMenuLanguageItem = styled.li<{ $active?: boolean }>`
  padding: 7.5px 15px;

  * {
    display: block;
    font-size: ${(props) =>
      props.theme.suomifi.values.typography.bodyTextSmall.fontSize.value}px;
    line-height: 24px;
    font-weight: ${(props) => (props.$active ? '600' : '400')};
  }
`;
