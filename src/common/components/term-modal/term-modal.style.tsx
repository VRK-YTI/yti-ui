import styled from 'styled-components';
import { Chip, Paragraph } from 'suomifi-ui-components';

export const TermModalParagraph = styled(Paragraph)`
  display: flex;
  flex-direction: column;
`;

export const TermModalChip = styled(Chip)`
  background: ${props => props.theme.suomifi.colors.successBase} !important;
  font-size: 12px;
  height: 18px;
  max-width: min-content;
  padding: 0px 5px !important;
`;
