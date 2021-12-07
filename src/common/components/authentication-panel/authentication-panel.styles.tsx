import styled from 'styled-components';
import { Breakpoint } from '../media-query/media-query-context';

export const ButtonsDiv = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: end;
  flex-direction: row;
  gap: 5px;
`;

export const UserInfoWrapper = styled.div<{ breakpoint: Breakpoint }>`
  display: flex;
  flex-direction: ${props => props.breakpoint === 'small' ? 'row' : 'column'};
  justify-content: space-between;
  row-gap: 2px;
  height: ${props => props.breakpoint === 'small' ? '44px': 'auto'};
  align-items: ${props => props.breakpoint === 'small' ? 'baseline' : 'normal'};

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
    padding-block: ${props => props.breakpoint === 'small' ? '14px' : '0'};
  }
`;

export const LoginButtonsWrapper = styled.div<{ breakpoint: Breakpoint }>`
  display: flex;
  flex-direction: ${props => props.breakpoint === 'small' ? 'column' : 'row'};
  gap: 5px;

  padding: ${props => props.breakpoint === 'small' ? '15px' : '0'};
  border-bottom: ${props => props.breakpoint === 'small' ? '1px' : '0'} solid ${props => props.theme.suomifi.colors.depthSecondary};
`;
