import styled from 'styled-components';
import { StaticChip } from 'suomifi-ui-components';

export const ResultTextWrapper = styled.div`
  padding: 10px 30px;
  border-bottom: 1px solid ${(props) => props.theme.suomifi.colors.depthDark2};
  && .fi-link--router {
    color: ${(props) => props.theme.suomifi.colors.blackBase};
    text-decoration: underline;
    display: inline-block;
    margin-right: 20px;
    :hover {
      color: ${(props) => props.theme.suomifi.colors.highlightBase};
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
        : props.theme.suomifi.colors.blackBase};;
  }
`;

export const MetadataChip = styled(StaticChip)`
  &&.fi-chip {
    background-color: #69D8D7;
    color: ${(props) => props.theme.suomifi.colors.blackBase};
  }
`;
