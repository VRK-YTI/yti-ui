import styled from 'styled-components';
import { Block, ModalFooter } from 'suomifi-ui-components';

export const ChipBlock = styled(Block)`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: ${(props) => props.theme.suomifi.spacing.xs};
  max-width: 100%;
`;

export const ResultList = styled.li`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.suomifi.spacing.s};
  margin-top: ${props => props.theme.suomifi.spacing.s};
`;

export const SearchBlock = styled(Block)`
  background: ${props => props.theme.suomifi.colors.depthLight3};
  border: 1px solid ${props => props.theme.suomifi.colors.depthLight1};
  display: flex;
  flex-direction: column;


  > div {
    display: flex;
    flex-direction: row;
    gap: 15px;
    padding: 10px 0px 10px 20px;
  }

  > div:last-child {
    padding: 10px 0px 10px 20px;
    border-top: 1px solid ${props => props.theme.suomifi.colors.depthLight1};
  }
`;

export const ModalFooterFitted = styled(ModalFooter)`

`;
