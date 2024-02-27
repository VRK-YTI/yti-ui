import styled from 'styled-components';
import { LoadingSpinner } from 'suomifi-ui-components';

export const StyledSpinner = styled(LoadingSpinner)`
  color: white;

  .fi-loadingSpinner_text {
    font-size: 14px !important;
  }

  .fi-loadingSpinner_icon {
    width: 22px !important;
    height: 22px !important;
  }

  .fi-icon-component-brand-fill {
    fill: white;
  }
`;

export const HeaderRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  .fi-text--bold:first-child {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;
