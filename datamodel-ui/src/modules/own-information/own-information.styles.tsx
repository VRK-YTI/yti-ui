import styled from 'styled-components';

export const PageContent = styled.div`
  border: 1px solid ${(props) => props.theme.suomifi.colors.depthLight1};
  background-color: white;
  display: flex;
  flex-direction: column;
  margin-bottom: ${(props) => props.theme.suomifi.spacing.xxxxl};
  padding: ${(props) => props.theme.suomifi.spacing.m};

  #organizations-and-roles {
    margin-top: 0;
  }
`;

export const OrgsAndRolesWrapper = styled.div`
  border: 1px solid ${(props) => props.theme.suomifi.colors.depthLight1};

  > div {
    padding: ${(props) => props.theme.suomifi.spacing.s};
  }

  > div:nth-child(even) {
    background-color: ${(props) => props.theme.suomifi.colors.depthLight2};
  }
`;

export const OrgsAndRolesUl = styled.ul`
  margin: 0;
  padding: 0;
  padding-left: ${(props) => props.theme.suomifi.spacing.m};
`;
