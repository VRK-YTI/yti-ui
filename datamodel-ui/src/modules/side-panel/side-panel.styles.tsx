import styled from 'styled-components';
import { Block, Button } from 'suomifi-ui-components';

export const OpenPanelButton = styled(Button)`
  padding: 0 0 0 6px;
  height: min-content;
  backgroundc-color: white;
  border-top: 1px solid gray;
  border-right: 1px solid gray;
  border-bottom: 1px solid gray;
`;

export const SidePanelBlock = styled(Block)<{ $open?: boolean }>`
  width: ${(props) => (props.$open ? '200px' : 'min-content')};
  height: ${(props) => (props.$open ? '400px' : 'min-content')};
  background-color: white;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  border-top: 1px solid gray;
  border-right: 1px solid gray;
  border-bottom: 1px solid gray;
`;
