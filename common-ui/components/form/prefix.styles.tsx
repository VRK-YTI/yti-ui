import styled from 'styled-components';
import { TextInput as TextInputDS } from 'suomifi-ui-components';

export const TextInput = styled(TextInputDS)`
  width: 100%;
  max-width: ${(props) => (props.fullWidth ? '100%' : '450px')};
`;

export const PrefixContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.suomifi.spacing.s};
`;
