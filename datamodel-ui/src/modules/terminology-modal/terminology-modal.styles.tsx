import styled from 'styled-components';
import { StaticChip } from 'suomifi-ui-components';

export const SearchBlock = styled.div<{ $isSmall?: boolean }>`
  display: flex;
  flex-direction: ${(props) => (props.$isSmall ? 'column' : 'flex')};
  justify-content: space-between;
  gap: ${(props) =>
    props.$isSmall
      ? props.theme.suomifi.spacing.xs
      : props.theme.suomifi.spacing.m};
  margin-bottom: ${(props) => props.theme.suomifi.spacing.s};

  .fi-search-input {
    width: 100%;
  }

  > div:last-child {
    width: 100% !important;

    ${(props) =>
      !props.$isSmall &&
      `
      max-width: 330px !important;
    `}
  }
`;

export const SelectedChipBlock = styled.div`
  display: flex;
  gap: ${(props) => props.theme.suomifi.spacing.xxs};
  margin-bottom: ${(props) => props.theme.suomifi.spacing.s};
`;

export const SearchResultsBlock = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid ${(props) => props.theme.suomifi.colors.depthDark3};
  border-bottom: none;
`;

export const SearchResultCount = styled.div`
  margin-bottom: ${(props) => props.theme.suomifi.spacing.m};
`;

export const SearchResultSubTitle = styled.div`
  display: flex;
  gap: ${(props) => props.theme.suomifi.spacing.xxs};
  color: ${(props) => props.theme.suomifi.colors.depthDark1};
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;

  > *:not(:first-child):before {
    content: '·';
    margin-right: ${(props) => props.theme.suomifi.spacing.xxs};
  }
`;

export const SearchResult = styled.div`
  display: flex;
  flex-direction: row;

  padding: ${(props) => props.theme.suomifi.spacing.xs}
    ${(props) => props.theme.suomifi.spacing.s};
  border-bottom: 1px solid ${(props) => props.theme.suomifi.colors.depthDark3};

  div:last-child {
    display: inherit;
    flex-direction: column;
    gap: ${(props) => props.theme.suomifi.spacing.xxs};
  }

  div > div {
    flex-direction: row;
  }

  .result-description {
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    line-clamp: 2;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .highlighted-content {
    background-color: rgba(250, 175, 0, 0.5);
  }
`;

export const StatusChip = styled(StaticChip)<{ $isValid?: boolean }>`
  font-size: inherit;
  line-height: inherit;
  padding: 2px 6px !important;

  background: ${(props) =>
    props.$isValid
      ? props.theme.suomifi.colors.successBase
      : props.theme.suomifi.colors.depthDark1} !important;

  .fi-chip--content {
    line-height: 1em !important;
  }
`;
