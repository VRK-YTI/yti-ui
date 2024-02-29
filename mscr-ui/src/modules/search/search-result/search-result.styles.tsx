import styled from 'styled-components';
import { RouterLink, StaticChip } from 'suomifi-ui-components';

export const StyledRouterLink = styled(RouterLink)`
  padding: 10px 30px;
  h4 {
    color: ${(props) => props.theme.suomifi.colors.blackBase};
    text-decoration: underline;
    display: inline-block;
    padding-right: 20px;
    margin-bottom: 10px;
  }
  && .fi-paragraph {
    margin-bottom: 18px;
  }
  :hover {
    h4 {
      color: ${(props) => props.theme.suomifi.colors.highlightBase};
    }
  }
  :focus {
    && {
      outline: none;
      box-shadow: none;
    }
    h4 {
      ${(props) => props.theme.suomifi.focuses.boxShadowFocus};
    }
  }
`;

export const ChipWrapper = styled.div`
  display: inline;
  margin: 3px;
  span {
    font-size: 13px;
  }
`;

export const TypeChip = styled(StaticChip)<{ $isSchema?: boolean }>`
  &&.fi-chip {
    border-style: solid;
    border-width: 2px;
    background-color: transparent;
    color: ${(props) =>
      props.$isSchema
        ? props.theme.suomifi.colors.highlightLight1
        : props.theme.suomifi.colors.blackBase};
    border-color: ${(props) =>
      props.$isSchema
        ? props.theme.suomifi.colors.highlightLight1
        : props.theme.suomifi.colors.blackBase};
  }
`;

export const MetadataChip = styled(StaticChip)`
  &&.fi-chip {
    background-color: #69d8d7;
    color: ${(props) => props.theme.suomifi.colors.blackBase};
  }
`;
