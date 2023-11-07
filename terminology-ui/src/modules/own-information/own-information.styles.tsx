import styled from 'styled-components';
import { Breakpoint } from 'yti-common-ui/media-query';
import { small } from 'yti-common-ui/media-query/styled-helpers';

export const PageContent = styled.div<{ $breakpoint: Breakpoint }>`
  border: 1px solid ${(props) => props.theme.suomifi.colors.depthLight1};
  background-color: white;
  display: flex;
  flex-direction: ${(props) => small(props.$breakpoint, 'column', 'row')};
  margin-bottom: ${(props) => props.theme.suomifi.spacing.xxxxl};
`;

export const MainContent = styled.main`
  flex-grow: 1;
  padding: ${(props) => props.theme.suomifi.spacing.m};
  padding-bottom: 40px;
`;

export const OrganizationAndRolesWrapper = styled.div`
  border: 1px solid ${(props) => props.theme.suomifi.colors.depthLight1};

  > :not(:first-child) {
    border-top: 1px solid ${(props) => props.theme.suomifi.colors.depthLight1};
  }

  > :nth-child(even) {
    background-color: ${(props) => props.theme.suomifi.colors.depthLight3};
  }
`;

export const OrganizationAndRoles = styled.div`
  padding: ${(props) => props.theme.suomifi.spacing.s};
`;

export const OrganizationAndRolesItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.suomifi.spacing.xxs};

  :not(:first-child) {
    margin-top: ${(props) => props.theme.suomifi.spacing.m};
  }

  ul {
    margin: 0;
    padding-left: ${(props) => props.theme.suomifi.spacing.m};
  }
`;

export const OrganizationAndRolesHeading = styled.div`
  font-weight: 600;
`;

export const SubscriptionsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  border: solid 1px ${(props) => props.theme.suomifi.colors.depthLight1};
`;

export const SubscriptionsListItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-block: ${(props) => props.theme.suomifi.spacing.xxs};
  padding-inline: ${(props) => props.theme.suomifi.spacing.s};

  background-color: ${(props) => props.theme.suomifi.colors.whiteBase};
  &:nth-child(even) {
    background-color: ${(props) => props.theme.suomifi.colors.depthLight3};
  }

  a {
    font-size: 16px;
    line-height: 24px;
  }

  &:not(:last-child) {
    border-bottom: solid 1px
      ${(props) => props.theme.suomifi.colors.depthLight1};
  }
`;
