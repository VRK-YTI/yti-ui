import styled from 'styled-components';
import { StaticChip } from 'suomifi-ui-components';

export const ResultTextWrapper = styled.div`
  padding-left: 30px;
  border-bottom: 1px solid ${(props) => props.theme.suomifi.colors.depthDark2};
`;

export const ChipWrapper = styled.div`
  display: inline;
  margin: 3px;
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
