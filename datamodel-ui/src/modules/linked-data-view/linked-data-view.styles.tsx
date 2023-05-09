import styled from 'styled-components';

export const LinkedWrapper = styled.ul`
  padding-left: 22px;
  margin: 0;

  li:not(:last-child) {
    margin-bottom: 5px;
  }

  > * {
    color: ${(props) => props.theme.suomifi.colors.highlightLight1};
  }
`;

export const LinkedItem = styled.li`
  a {
    font-size: 16px;
  }
`;

export const LinkExtraInfo = styled.div`
  display: flex;
  flex-direction: column;
  color: ${(props) => props.theme.suomifi.colors.blackBase};
`;
