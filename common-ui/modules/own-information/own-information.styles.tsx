import styled from 'styled-components';
import { Modal } from 'suomifi-ui-components';

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

  #email-notifications {
    margin-top: 0;
  }

  #remove-all-subscriptions-wrapper {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-top: ${(props) => props.theme.suomifi.spacing.xs};
  }

  #remove-all-subscriptions-button {
    width: max-content;
  }

  .small-margin {
    margin-top: 0;
  }

  .fi-inline-alert {
    margin-top: ${(props) => props.theme.suomifi.spacing.m};
  }
`;

export const OrgsAndRolesWrapper = styled.div`
  border: 1px solid ${(props) => props.theme.suomifi.colors.depthLight1};

  > div {
    padding: ${(props) => props.theme.suomifi.spacing.s};
  }

  > div:not(:first-child) {
    border-top: 1px solid ${(props) => props.theme.suomifi.colors.depthLight1};
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

export const SubscriptionsWrapper = styled.div`
  border: 1px solid ${(props) => props.theme.suomifi.colors.depthLight1};

  > div {
    padding: ${(props) =>
      `${props.theme.suomifi.spacing.xxs} ${props.theme.suomifi.spacing.xs}`};

    display: flex;
    justify-content: space-between;
    align-items: center;

    .fi-link {
      font-size: 16px;
    }

    .fi-button {
      padding: 5px 10px !important;
    }

    .fi-icon {
      margin-right: 0 !important;
    }
  }

  > div:not(:first-child) {
    border-top: 1px solid ${(props) => props.theme.suomifi.colors.depthLight1};
  }

  > div:nth-child(even) {
    background-color: ${(props) => props.theme.suomifi.colors.depthLight3};
  }
`;

export const NarrowModal = styled(Modal)`
  max-width: 540px !important;

  .fi-modal_content {
    padding: 24px 30px 10px !important;

    > div {
      margin-top: ${(props) => props.theme.suomifi.spacing.m};
    }
  }

  .fi-modal_footer_content-gradient-overlay {
    display: none;
    visibility: hidden;
  }
`;
