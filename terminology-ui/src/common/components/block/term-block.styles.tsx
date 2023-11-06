import { default as styled } from 'styled-components';

export const TermWrapper = styled.span`
  display: flex;
  gap: ${(props) => props.theme.suomifi.spacing.xxs};
  justify-content: space-between;

  *:last-child {
    min-width: 50%;
  }
`;
