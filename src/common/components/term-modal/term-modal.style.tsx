import styled from 'styled-components';
import { Button, Chip, Paragraph } from 'suomifi-ui-components';

export const TermModalButton = styled(Button)`
  padding: 0;
  min-height: auto;
`;

export const TermModalParagraph = styled(Paragraph)`
  display: flex;
  flex-direction: column;
`;

export const TermModalChip = styled(Chip)<{isValid: boolean}>`
  background: ${props => props.isValid ? props.theme.suomifi.colors.successBase : props.theme.suomifi.colors.depthDark2} !important;
  font-size: 12px;
  height: 18px;
  margin-top: 5px;
  max-width: min-content;
  padding: 0px 5px !important;
  text-transform: uppercase;
`;
