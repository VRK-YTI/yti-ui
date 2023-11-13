import styled from 'styled-components';
import { Block } from 'suomifi-ui-components';

export const FilterTopPartBlock = styled(Block)`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.suomifi.spacing.m};
`;

export const ResultAndFilterContainer = styled.div`
  display: flex;
  flex-direction: row-reverse;
  flex-wrap: nowrap;
  gap: ${(props) => props.theme.suomifi.spacing.xl};
  justify-content: space-between;
  margin-bottom: ${(props) => props.theme.suomifi.spacing.xxxxl};
  margin-top: ${(props) => props.theme.suomifi.spacing.m};
`;

export const ResultAndStatsWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const QuickActionsWrapper = styled.div<{ $isSmall?: boolean }>`
  width: 100%;
  display: flex;
  flex-direction: ${(props) => (props.$isSmall ? 'column' : 'row')};

  gap: ${(props) => props.theme.suomifi.spacing.xs};
  & :nth-child(1) {
    flex-grow: 1;
  }
`;
