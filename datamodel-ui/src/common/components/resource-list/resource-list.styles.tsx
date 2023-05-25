import styled from 'styled-components';
import { StaticChip } from 'suomifi-ui-components';

export const ResultsTable = styled.table<{ $expandedLastCell?: boolean }>`
  width: 100%;
  border: 1px solid ${(props) => props.theme.suomifi.colors.depthLight1};
  border-collapse: collapse;
  overflow-x: scroll;

  thead {
    border-bottom: 3px solid
      ${(props) => props.theme.suomifi.colors.highlightLight1};
    font-weight: 600;

    tr:first-child {
      background-color: ${(props) => props.theme.suomifi.colors.depthLight2};
    }

    tr:not(:last-child) {
      border-bottom: 1px solid
        ${(props) => props.theme.suomifi.colors.depthLight1};
    }
  }

  td {
    padding: 10px 15px;
  }

  td:not(:first-child) {
    width: 25%;
  }

  ${(props) =>
    props.$expandedLastCell &&
    `
    td:last-child {
      width: 50%;
    }
  `}

  tbody {
    tr {
      border-bottom: 1px solid
        ${(props) => props.theme.suomifi.colors.depthLight1};
      vertical-align: top;

      &:hover {
        background-color: ${(props) =>
          props.theme.suomifi.colors.depthSecondary};
      }

      td > div {
        display: flex;
        flex-direction: column;
      }
    }
  }

  .td-with-button {
    display: flex;
    gap: 20px;
  }
`;

export const StatusChip = styled(StaticChip)<{ $isValid?: boolean }>`
  font-size: inherit;
  line-height: inherit;
  padding: 2px 6px !important;
  width: min-content;
  font-size: 14px;

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
