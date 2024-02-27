import styled from 'styled-components';
import { SearchInput } from 'suomifi-ui-components';

export const TitleWrapper = styled.div<{ $fullScreen?: boolean }>`
  padding: 0 0
    ${(props) =>
      `${props.theme.suomifi.spacing.s} ${props.theme.suomifi.spacing.m}`};

  ${(props) =>
    props.$fullScreen &&
    `
    flex: 1;
    display: flex;
    gap: 20px;
    align-items: center;

    max-height: min-content;
    overflow: hidden;

    .tools {
      display: inherit;
      gap: inherit;
      align-self: flex-start;
      padding-top: 20px;
    }
  `}
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-direction: row;
  height: 100%;
  width: 100%;
`;

export const ModelInfoListWrapper = styled.ul`
  margin-top: ${(props) => props.theme.suomifi.spacing.xxs};
  margin-bottom: ${(props) => props.theme.suomifi.spacing.xxs};
  list-style-type: none;

  > li::marker {
    content: '• ';
    color: ${(props) => props.theme.suomifi.colors.highlightLight1};
  }

  > li a {
    margin-left: ${(props) => props.theme.suomifi.spacing.xxs};
  }
`;

export const FullwidthSearchInput = styled(SearchInput)`
  width: 100%;
  max-width: 380px;
`;

export const StaticHeaderWrapper = styled.div`
  width: inherit;
  max-width: inherit;
  position: fixed;
  background: ${(props) => props.theme.suomifi.colors.whiteBase};
  z-index: 2;
  height: min-content;

  h2 {
    font-size: 18px !important;
  }

  > div {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: ${(props) => props.theme.suomifi.spacing.s};
    padding-bottom: 0;
  }
`;

export const LanguagePickerWrapper = styled.div`
  margin-top: -35px;
  margin-right: 10px;
  padding-right: 3px;

  .fi-dropdown {
    width: min-content;
  }

  .fi-dropdown_button {
    min-width: max-content !important;
    word-break: keep-all !important;
    white-space: nowrap !important;
  }

  .fi-label {
    display: none;
  }
`;

export const LinksWrapper = styled.ul`
  margin: 0;
  padding: 0 ${(props) => props.theme.suomifi.spacing.l};
`;

export const PriorVersionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.suomifi.spacing.s};
`;

export const PriorVersionsDetails = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.suomifi.spacing.xs};
`;
