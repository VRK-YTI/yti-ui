import styled from 'styled-components';
import { StaticChip } from 'suomifi-ui-components';

export const SearchToolsBlock = styled.div`
  width: 100%;
  max-width: 1800px;
  display: flex;
  gap: 10px;
  margin-bottom: 15px;

  > div {
    flex: 1;
    min-width: 200px;
  }

  .wider {
    flex: 2;
    max-width: 100% !important;
  }

  .fi-single-select {
    max-width: 250px;
  }
`;

export const ResultsTable = styled.table`
  width: 100%;
  border: 1px solid ${(props) => props.theme.suomifi.colors.depthLight1};
  border-bottom: 0;
  border-collapse: collapse;
  overflow-x: scroll;

  tr > td {
    padding: 10px 15px;
  }

  tr:not(:first-child) {
    border-bottom: 1px solid
      ${(props) => props.theme.suomifi.colors.depthLight1};
    vertical-align: top;

    &:hover {
      background-color: ${(props) => props.theme.suomifi.colors.depthSecondary};
    }

    td > div {
      display: flex;
      flex-direction: column;
    }
  }

  tr:first-child {
    background-color: ${(props) => props.theme.suomifi.colors.depthLight2};
    border-bottom: 2px solid
      ${(props) => props.theme.suomifi.colors.highlightLight1};
  }

  .td-with-radio-button {
    display: flex;
    gap: 5px;
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
