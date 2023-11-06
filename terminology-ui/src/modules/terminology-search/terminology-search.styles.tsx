import { default as styled } from 'styled-components';
import { Block, Button } from 'suomifi-ui-components';

export const FilterMobileButton = styled(Button)`
  margin-top: ${(props) => props.theme.suomifi.spacing.xs};
`;

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
