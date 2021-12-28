import styled from 'styled-components';

export const ResultAndFilterContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: ${props => props.theme.suomifi.spacing.xl};
  justify-content: space-between;
  margin-top: ${props => props.theme.suomifi.spacing.m};
`;

export const ResultAndStatsWrapper = styled.div`
  display: flex,
  flex-direction: column;
  width: 100%;
`;
