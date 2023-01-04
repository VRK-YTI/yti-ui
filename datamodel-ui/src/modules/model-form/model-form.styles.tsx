import styled from 'styled-components';
import { MultiSelect } from 'suomifi-ui-components';

export const ModelFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.suomifi.spacing.m};
`;

export const WideMultiSelect = styled(MultiSelect)`
  min-width: 100%;
`;
