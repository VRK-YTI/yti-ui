import styled from 'styled-components';

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
