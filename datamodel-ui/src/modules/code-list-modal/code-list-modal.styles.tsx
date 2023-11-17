import styled from 'styled-components';
import { StatusChip as BaseStatusChip } from 'yti-common-ui/status-chip';
import { Status } from '@app/common/interfaces/status.interface';

export const FilterBlockWrapper = styled.div<{ extendedView?: boolean }>`
  width: 100%;
  max-width: 100%;
  margin-bottom: ${(props) => props.theme.suomifi.spacing.m};

  ${(props) =>
    props.extendedView
      ? `
    display: flex;
    flex-direction: row;
    gap: ${props.theme.suomifi.spacing.m};

    > div {
      display: flex;
      flex-direction: row;
      gap: ${props.theme.suomifi.spacing.m};
    }

    * {
      min-width: 200px !important;
    }
  `
      : `
  > div {
    display: flex;
    justify-content: space-between;
    gap: ${props.theme.suomifi.spacing.m};

    .fi-text-input {
      flex-grow: 4;
    }

    .fi-single-select {
      flex-grow: 4;
      min-height: min-content;
      height: min-content;
    }
  }

  > div:first-child {
    margin-bottom: ${props.theme.suomifi.spacing.m};
  }
  `}
`;

export const FilterBlock = styled.div`
  max-width: 100%;
  margin-bottom: ${(props) => props.theme.suomifi.spacing.m};

  > div {
    display: flex;
    justify-content: space-between;
    gap: ${(props) => props.theme.suomifi.spacing.m};

    .fi-text-input {
      flex-grow: 4;
    }

    .fi-single-select {
      flex-grow: 4;
      min-height: min-content;
      height: min-content;
    }
  }

  > div:first-child {
    margin-bottom: ${(props) => props.theme.suomifi.spacing.m};
  }
`;

export const ResultBlock = styled.div`
  label {
    font-size: 18px;
  }

  .total-results {
    margin-bottom: ${(props) => props.theme.suomifi.spacing.m};
  }

  .results {
    border: 1px solid ${(props) => props.theme.suomifi.colors.blackLight1};
    border-bottom: 0;
  }

  .result,
  .result-highlighted {
    border-bottom: 1px solid
      ${(props) => props.theme.suomifi.colors.blackLight1};
    padding: ${(props) => props.theme.suomifi.spacing.s};

    &:hover {
      background-color: ${(props) =>
        props.theme.suomifi.colors.highlightLight3};
      cursor: pointer;
    }

    > div:not(:first-child) {
      margin-left: ${(props) => props.theme.suomifi.spacing.l};
      margin-top: 5px;
    }
  }

  .result-highlighted {
    background-color: ${(props) => props.theme.suomifi.colors.highlightLight3};
  }

  .subtitle {
    font-size: 12px;
    color: ${(props) => props.theme.suomifi.colors.depthDark1};
    text-transform: uppercase;
    font-weight: 600;
    display: flex;
    gap: ${(props) => props.theme.suomifi.spacing.xxs};
  }

  .description {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .link > a {
    font-size: 14px;
  }
`;

export const StatusChip = styled(BaseStatusChip)<{ status?: Status }>`
  padding: 3px 6px 0 6px !important;
  width: min-content;
  font-size: 12px;
  .fi-chip--content {
    line-height: 1em !important;
    white-space: nowrap;
    text-transform: uppercase;
  }
`;

export const ResultsAndInfoBlockWrapper = styled.div<{
  $extendedView?: boolean;
}>`
  ${(props) =>
    props.$extendedView &&
    `
  display: flex;
  flex-direction: row;
  gap: ${props.theme.suomifi.spacing.m};

  > div {
    width: 50%;

  }
  `}
`;

export const InfoBlock = styled.div`
  .fi-paragraph {
    margin-bottom: ${(props) => props.theme.suomifi.spacing.s};
  }

  table {
    width: 100%;
    padding: 0;
    border-spacing: 0;
    border: 1px solid ${(props) => props.theme.suomifi.colors.depthLight1};
    border-bottom: 0;
  }

  thead {
    background-color: ${(props) => props.theme.suomifi.colors.depthLight3};
    word-break: normal;
    font-weight: 600;
  }

  td {
    border-bottom: 1px solid
      ${(props) => props.theme.suomifi.colors.depthLight1};
    padding: ${(props) => props.theme.suomifi.spacing.m};
  }

  td:last-child {
    white-space: break-spaces;
    word-break: normal;
  }
`;

export const SelectedChipsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${(props) => props.theme.suomifi.spacing.xxs};
  margin-bottom: ${(props) => props.theme.suomifi.spacing.m};
`;
