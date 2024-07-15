import styled from 'styled-components';

export const ActionMenuWrapper = styled.div`
  && .fi-button--secondary:hover {
    background: #fff;
  }

  && button.deleteDraft {
    color: ${(props) => props.theme.suomifi.colors.alertBase};
    border-top: 1px solid ${(props) => props.theme.suomifi.colors.depthLight1};
    &&:hover {
      color: white;
    }
  }

  && button.deleteDraft:hover, button.deleteDraft.fi-action-menu-item--selected {
    color: ${(props) => props.theme.suomifi.colors.whiteBase};
    background-color: ${(props) => props.theme.suomifi.colors.alertBase};
  }

  && .fi-action-menu-popover {
    padding: 0;
  }
`;
