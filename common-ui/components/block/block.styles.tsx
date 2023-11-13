import styled from 'styled-components';

export const BasicBlockWrapper = styled.div<{
  $largeGap?: boolean;
  $largeWidth?: boolean;
  $isSmall?: boolean;
}>`
  display: flex;
  flex-direction: column;
  gap: ${(props) => (props.$largeGap ? '10px' : '5px')};
  max-width: ${(props) =>
    props.$largeWidth ? '800px' : props.$isSmall ? '100%' : '695px'};
  font-size: 16px;
  line-height: 24px;

  &:not(:first-child) {
    margin-top: 20px;
  }
`;

export const BasicBlockHeader = styled.div`
  font-weight: 600;

  h2 {
    font-size: 16px;
    font-weight: 600;
    margin: 0;
  }
`;

export const BasicBlockExtraWrapper = styled.div<{
  $position?: 'left' | 'right';
  $isWide?: boolean;
  $isSmall?: boolean;
}>`
  margin-top: 10px;
  text-align: ${(props) => props.$position ?? 'left'};
  min-width: ${(props) =>
    props.$isWide && !props.$isSmall ? '800px' : 'unset'};
`;

export const List = styled.ul`
  margin: 0;
  margin-left: 20px;
  padding: 0;
`;
