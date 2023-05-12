import styled from 'styled-components';
import { Modal } from 'suomifi-ui-components';

export const WideModal = styled(Modal)`
  ${(props) =>
    props.variant === 'default' &&
    `
width: 95vw !important;
`}
`;

export const ListWrapper = styled.div<{ $spaceBottom?: boolean }>`
  width: 100%;

  ${(props) =>
    props.$spaceBottom && `margin-bottom: ${props.theme.suomifi.spacing.xxl};`}

  .title-row {
    background-color: ${(props) => props.theme.suomifi.colors.depthLight3};
    border: 1px solid ${(props) => props.theme.suomifi.colors.depthLight1};
    font-weight: 600;
    padding: 5px 20px;
  }
`;

export const StyledTable = styled.table`
  width: 100%;
  border: 1px solid ${(props) => props.theme.suomifi.colors.depthLight1};
  border-collapse: collapse;
  table-layout: fixed;

  thead {
    font-weight: 600;

    tr {
      margin-left: 20px;
      border-bottom: 3px solid
        ${(props) => props.theme.suomifi.colors.highlightDark1};
    }

    td:not(:last-child) {
      width: 200px;
    }

    td:first-child {
      width: 30px;
    }
  }

  tr {
    border-bottom: 1px solid
      ${(props) => props.theme.suomifi.colors.depthLight1};
  }

  td {
    padding: 15px;
    vertical-align: top;
  }

  td:first-child {
    vertical-align: top;
    align-items: center;
  }

  div {
    display: flex;
    flex-direction: column;
    align-items: inherit;
  }

  .fi-checkbox_label {
    left: 4px;
  }
`;
