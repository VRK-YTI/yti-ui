import styled from 'styled-components';
import { Block } from 'suomifi-ui-components';

export const SearchContainer = styled(Block)`
  visibility: visible;
  display: flex;
  align-items: start;
  background-color: ${(props) => props.theme.suomifi.colors.depthLight3};
  z-index: 1;
`;

export const FacetsWrapper = styled(Block)`
  padding: 20px 30px 0 30px;
  flex: 0 0 240px;
`;

export const ResultsWrapper = styled(Block)`
  margin-left: ${(props) => props.theme.suomifi.spacing.xxl};
  flex: 1;
`;

export const CloseButton = styled.button`
  flex: 0;
`;
