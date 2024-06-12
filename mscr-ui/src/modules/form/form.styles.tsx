import styled from 'styled-components';
import { Block, MultiSelect } from 'suomifi-ui-components';

export const ModelFormContainer = styled(Block)`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.suomifi.spacing.l};

  > hr {
    margin: 0;
  }
`;

export const WideMultiSelect = styled(MultiSelect)`
  min-width: 100%;
`;
