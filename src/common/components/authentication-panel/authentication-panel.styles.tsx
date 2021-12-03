import styled from 'styled-components';

export const ButtonsDiv = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: end;
  flex-direction: row;
  gap: 5px;
`;

export const UserInfoWrapper = styled.div<{ isSmall: boolean }>`
  display: flex;
  flex-direction: ${props => props.isSmall ? 'row' : 'column'};
  justify-content: space-between;
  row-gap: 2px;
  height: ${props => props.isSmall ? '44px': 'auto'};
  align-items: ${props => props.isSmall ? 'baseline' : 'normal'};

  span {
    font-size: 16px;
    line-height: 21px;
    font-weight: 600;
    text-align: right;
  }

  a {
    font-size: 12px;
    line-height: 15px;
    font-weight: 600;
    text-transform: uppercase;
    padding-block: ${props => props.isSmall ? '14px' : '0'};
  }
`;

export const LoginButtonsWrapper = styled.div<{ isSmall: boolean }>`
  display: flex;
  flex-direction: ${props => props.isSmall ? 'column' : 'row'};
  gap: 5px;

  padding: ${props => props.isSmall ? '15px' : '0'};
  border-bottom: ${props => props.isSmall ? '1px' : '0'} solid ${props => props.theme.suomifi.colors.depthSecondary};
`;
