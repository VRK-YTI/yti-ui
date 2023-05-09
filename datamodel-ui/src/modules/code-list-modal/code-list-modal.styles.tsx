import styled from 'styled-components';
import { StaticChip } from 'suomifi-ui-components';

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

    .fi-dropdown:first-child {
      flex-grow: 4;

      span {
        width: calc(100% - 47px);
      }
    }
  }

  div:first-child {
    margin-bottom: ${(props) => props.theme.suomifi.spacing.xs};
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

  .result {
    border-bottom: 1px solid
      ${(props) => props.theme.suomifi.colors.blackLight1};
    padding: ${(props) => props.theme.suomifi.spacing.s};

    > div:not(:first-child) {
      margin-left: ${(props) => props.theme.suomifi.spacing.l};
      margin-top: 5px;
    }
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

export const StatusChip = styled(StaticChip)<{ $isValid?: boolean }>`
  font-size: inherit;
  line-height: inherit;
  padding: 3px 6px 0 6px !important;
  width: min-content;
  font-size: 12px;

  background: ${(props) =>
    props.$isValid
      ? props.theme.suomifi.colors.successBase
      : props.theme.suomifi.colors.depthDark1} !important;

  .fi-chip--content {
    line-height: 1em !important;
    white-space: nowrap;
    text-transform: uppercase;
  }
`;
