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

export const BlockContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.suomifi.spacing.m};
`;

export const WideMultiSelect = styled(MultiSelect)`
  min-width: 100%;
`;

export const AddBlockWrapper = styled(Block)`
  display: flex;
  flex-direction: column;

  > .fi-label {
    margin-bottom: 6px;
  }

  > button {
    width: max-content;

    :not(:last-child) {
      margin-bottom: ${(props) => props.theme.suomifi.spacing.m};
    }
  }
`;
