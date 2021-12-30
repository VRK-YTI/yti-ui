import styled from 'styled-components';
import { Button } from 'suomifi-ui-components';

export const FilterMobileButton = styled(Button)`
  margin-top: 20px;
`;

export const ResultAndFilterContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 30px;
  justify-content: space-between;
  margin-bottom: 80px;
  margin-top: 20px;
`;

export const ResultAndStatsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const PaginationWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;
