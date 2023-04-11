import styled from 'styled-components';
import { ExpanderGroup } from 'suomifi-ui-components';

export const SelectedConceptsGroup = styled(ExpanderGroup)`
  margin-bottom: ${(props) => props.theme.suomifi.spacing.xxs};

  .fi-hint-text {
    color: ${(props) => props.theme.suomifi.colors.depthDark1};
  }
`;

export const SearchBlock = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${(props) => props.theme.suomifi.spacing.m};
  margin-bottom: ${(props) => props.theme.suomifi.spacing.m};

  .fi-search-input {
    flex: 2 auto;
  }

  .fi-single-select {
    flex: 1 auto;
  }
`;

export const SearchResultWrapper = styled.div`
  margin-top: ${(props) => props.theme.suomifi.spacing.m};
  border: 1px solid ${(props) => props.theme.suomifi.colors.depthLight1};
  border-bottom: 0;

  .item-wrapper {
    display: flex;
    gap: ${(props) => props.theme.suomifi.spacing.xxs};
    border-bottom: 1px solid
      ${(props) => props.theme.suomifi.colors.depthLight1};
    padding: 10px 15px 15px;

    .fi-link--external {
      font-size: 14px;
      line-height: 18px;
      margin-top: ${(props) => props.theme.suomifi.spacing.xxs};
      display: flex;
      align-items: center;
    }
  }

  .selected {
    background-color: ${(props) => props.theme.suomifi.colors.highlightLight3};
  }

  .subtitle {
    display: flex;
    align-items: center;
    gap: ${(props) => props.theme.suomifi.spacing.xxs};
    margin: ${(props) => props.theme.suomifi.spacing.xxs} 0;

    .fi-text--body {
      font-size: 14px;
      font-weight: 600;
      text-transform: uppercase;
      color: ${(props) => props.theme.suomifi.colors.depthDark1};
    }

    .fi-chip {
      padding: 1px 5px;
      font-size: 12px;
      line-height: 15px;
      text-transform: uppercase;
    }

    .valid {
      background-color: ${(props) => props.theme.suomifi.colors.successBase};
    }

    .other {
      background-color: ${(props) => props.theme.suomifi.colors.depthDark2};
    }
  }

  .description {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  .highlighted-content {
    background-color: rgba(250, 175, 0, 0.5);
  }
`;
