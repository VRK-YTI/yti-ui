import styled from 'styled-components';
import { Button, Heading, Text } from 'suomifi-ui-components';

export const TermHeading = styled(Heading)`
  font-size: 16px !important;
`;

export const TermModalButton = styled(Button)`
  font-size: 16px;
  font-weight: 400;
  padding: 0;
  min-height: auto;
`;

export const TermModalChip = styled.span<{ $isValid?: string }>`
  align-items: center;
  background: ${(props) =>
    props.$isValid === 'true'
      ? props.theme.suomifi.colors.successBase
      : props.theme.suomifi.colors.depthDark2};
  border-radius: 10px;
  display: flex;
  color: ${(props) => props.theme.suomifi.colors.whiteBase};
  font-size: 12px;
  height: 18px;
  margin-top: 5px;
  margin-bottom: 20px;
  max-width: min-content;
  padding: 0px 5px;
  text-transform: uppercase;
  white-space: nowrap;
`;

export const TermText = styled(Text)`
  display: grid;
  font-size: 16px;
  margin-bottom: ${(props) => props.theme.suomifi.spacing.m};
`;
