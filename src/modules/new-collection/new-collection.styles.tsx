import styled from 'styled-components';
import { Block, Text, Textarea, TextInput } from 'suomifi-ui-components';

export const NewCollectionBlock = styled(Block)`
  background: white;
  border: 1px solid ${(props) => props.theme.suomifi.colors.depthLight1};
  margin-bottom: 80px;
  margin-top: ${(props) => props.theme.suomifi.spacing.m};
  padding: 30px 80px 20px 80px;
`;

export const PageHelpText = styled(Text)`
  display: inline-block;
  max-width: 700px;
`;

export const TextBlockWrapper = styled(Block)`
  margin-top: ${(props) => props.theme.suomifi.spacing.m};

  > * {
    margin-bottom: ${(props) => props.theme.suomifi.spacing.m};
  }
`;

export const NameTextInput = styled(TextInput)`
  max-width: 500px;
  width: 100%;
`;

export const DescriptionTextarea = styled(Textarea)`
  max-width: 680px;
  width: 100%;

  textarea {
    height: 88px;
  }
`;

export const FooterBlock = styled(Block)`
  display: flex;
  gap: ${(props) => props.theme.suomifi.spacing.s};
`;
