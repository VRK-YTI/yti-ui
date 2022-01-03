import styled from 'styled-components';

export const BasicBlockWrapper = styled.div<{ largeGap?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${props => props.largeGap ? '10px' : '5px'};
  max-width: 695px;
  font-size: 16px;
  line-height: 24px;

  :not(:first-child) {
    margin-top: 20px;
  }
`;

export const BasicBlockHeader = styled.div`
  font-weight: 600;
`;

export const BasicBlockExtraWrapper = styled.div`
  margin-top: 10px;
`;

export const List = styled.ul`
  margin: 0;
  margin-left: 20px;
  padding: 0;
`;
