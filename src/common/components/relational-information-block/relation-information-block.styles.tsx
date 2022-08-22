import styled from 'styled-components';
import { Block } from 'suomifi-ui-components';

export const ChipBlock = styled(Block)`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: ${(props) => props.theme.suomifi.spacing.xs};
  max-width: 100%;
`;

export const ResultList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.suomifi.spacing.s};
  list-style: none;
  margin-top: ${(props) => props.theme.suomifi.spacing.s};
  padding: 0;
`;

export const SearchBlock = styled(Block) <{ $isSmall?: boolean }>`
  background: ${(props) => props.theme.suomifi.colors.depthLight3};
  border: 1px solid ${(props) => props.theme.suomifi.colors.depthLight1};
  display: flex;
  flex-direction: column;

  > div {
    display: flex;
    flex-direction: ${props => props.$isSmall ? 'column' : 'row'};
    gap: 15px;
    padding: ${props => props.$isSmall ? '10px' : '10px 0px 10px 20px'};
  }

  > div:last-child {
    padding: ${props => props.$isSmall ? '10px' : '10px 0px 10px 20px'};
    border-top: 1px solid ${(props) => props.theme.suomifi.colors.depthLight1};
  }
`;
