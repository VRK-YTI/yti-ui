import styled from 'styled-components';

export const SearchToolsBlock = styled.div`
  width: 100%;
  max-width: 1300px;
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

  .fi-single-select,
  .fi-dropdown {
    max-width: min-content;
  }

  .fi-dropdown_button {
    min-width: 135px !important;
  }

  .status-picker {
    span {
      min-width: 150px !important;
      white-space: nowrap !important;
    }
  }

  .data-model-picker {
    span {
      min-width: 240px !important;
      max-width: 330px !important;
      white-space: nowrap !important;
    }
  }
`;
