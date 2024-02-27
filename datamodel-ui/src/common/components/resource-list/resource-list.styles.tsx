import styled from 'styled-components';
import { StatusChip as BaseStatusChip } from 'yti-common-ui/status-chip';

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

  td:first-child {
    min-width: 25%;
  }

  td:not(:first-child) {
    width: 25%;
  }

  td:last-child {
    width: auto;
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

      td:last-child > div {
        overflow: hidden;
        text-overflow: ellipsis;
        max-height: 80px;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
      }
    }
  }

  .td-with-button {
    display: flex;
    gap: 20px;
  }
`;

export const StatusChip = styled(BaseStatusChip)<{ status?: string }>`
  width: min-content;
  font-size: 14px;
  .fi-chip--content {
    line-height: 1em !important;
    white-space: nowrap;
    text-transform: uppercase;
  }
`;
