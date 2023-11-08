import styled from 'styled-components';
import { Block, Paragraph } from 'suomifi-ui-components';

export const FooterBlock = styled(Block)`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.suomifi.spacing.s};
`;

export const DescriptionParagraph = styled(Paragraph)`
  margin-bottom: ${(props) => props.theme.suomifi.spacing.s};
`;
