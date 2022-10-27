import styled from 'styled-components';
import { Text } from 'suomifi-ui-components';

export const CardConcepts = styled(Text)`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  &:before {
    content: attr(value);
    font-weight: 600;
    margin-bottom: 5px;
    width: 100%;
  }
`;

export const ResultWrapper = styled.div<{ $isSmall: boolean }>`
  border-right: ${(props) =>
    props.$isSmall
      ? 'none'
      : `1px solid ${props.theme.suomifi.colors.depthLight1}`};
  border-left: ${(props) =>
    props.$isSmall
      ? 'none'
      : `1px solid ${props.theme.suomifi.colors.depthLight1}`};
  margin-left: -${(props) => (props.$isSmall ? props.theme.suomifi.spacing.s : '0')};
  margin-right: -${(props) => (props.$isSmall ? props.theme.suomifi.spacing.s : '0')};
  padding: 0;
  margin-top: 0;

  > *:first-child {
    border-top: 1px solid ${(props) => props.theme.suomifi.colors.depthLight1};
  }

  > * {
    border-bottom: 1px solid
      ${(props) => props.theme.suomifi.colors.depthLight1};
  }
`;
