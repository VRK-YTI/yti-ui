import styled from 'styled-components';
import { Button, Chip, Heading, Text } from 'suomifi-ui-components';

export const TermHeading = styled(Heading)`
  font-size: 16px !important;
`;

export const TermModalButton = styled(Button)`
  padding: 0;
  min-height: auto;
`;

export const TermModalChip = styled(Chip)<{ isvalid?: string }>`
  background: ${props => props.isvalid === 'true' ? props.theme.suomifi.colors.successBase : props.theme.suomifi.colors.depthDark2} !important;
  display: grid;
  font-size: 12px;
  height: 18px;
  margin-top: 5px;
  margin-bottom: 20px;
  max-width: min-content;
  padding: 0px 5px !important;
  text-transform: uppercase;
`;

export const TermText = styled(Text)`
  display: grid;
  font-size: 16px;
  margin-bottom: ${props => props.theme.suomifi.spacing.m};
`;
