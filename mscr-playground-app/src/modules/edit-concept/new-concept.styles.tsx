import styled from 'styled-components';
import { Block, Text } from 'suomifi-ui-components';

export const FooterBlock = styled(Block)`
  > div {
    display: flex;
    gap: ${(props) => props.theme.suomifi.spacing.s};
  }
`;

export const NewConceptBlock = styled(Block)<{ $isSmall?: boolean }>`
  background: white;
  border: 1px solid ${(props) => props.theme.suomifi.colors.depthLight1};
  margin-bottom: 80px;
  margin-top: ${(props) => props.theme.suomifi.spacing.m};
  padding: ${(props) => (props.$isSmall ? '20px' : '30px 80px 20px 80px')};
`;

export const PageHelpText = styled(Text)`
  display: inline-block;
  max-width: 700px;
`;

export const ButtonBlock = styled(Block)`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.suomifi.spacing.s};
`;
