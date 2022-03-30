import styled from 'styled-components';
import { Button } from 'suomifi-ui-components';
import { Breakpoint } from '@app/common/components/media-query/media-query-context';
import { small } from '@app/common/components/media-query/styled-helpers';

export const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 57px;
  gap: 0px;
`;

export const SearchAndLanguageWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.suomifi.spacing.m};
`;

export const SearchWrapper = styled.div`
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

export const SiteLogo = styled.div<{ breakpoint: Breakpoint }>`
  flex-grow: ${(props) => small(props.breakpoint, '1', '0')};
  line-height: 0;

  a {
    display: block;
    line-height: 0;
  }
`;

export const AuthenticationPanelWrapper = styled.div`
  align-self: center;
`;
