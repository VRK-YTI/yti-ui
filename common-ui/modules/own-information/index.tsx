import { useTranslation } from 'next-i18next';
import { Breadcrumb, BreadcrumbLink } from '../../components/breadcrumb';
import {
  OrgsAndRolesUl,
  OrgsAndRolesWrapper,
  PageContent,
  SubscriptionsWrapper,
} from './own-information.styles';
import {
  Heading,
  InlineAlert,
  Link,
  ToggleButton,
} from 'suomifi-ui-components';
import { BasicBlock, BasicBlockExtraWrapper } from '../../components/block';
import Separator from '../../components/separator';
import { User } from '../../interfaces/user.interface';
import { Organization } from '../../interfaces/organization.interface';
import { Request } from '../../interfaces/request.interface';
import { Subscriptions } from '../../interfaces/subscription.interface';
import { useEffect } from 'react';
import { translateRole } from '../../utils/translation-helpers';

interface OwnInformationProps {
  user: User;
  organizations?: Organization[];
  requests?: Request[];
  subscriptions?: Subscriptions;
  toggleSubscriptionsResult: {
    isSuccess: boolean;
    isError: boolean;
    isLoading: boolean;
    data?: Subscriptions;
  };
  renderPermissionModal: (props: {
    organizations?: Organization[];
  }) => JSX.Element;
  renderSubscriptionModal: (props: {
    resourceIds: string[];
    singular?: boolean;
  }) => JSX.Element;
  refetchSubscriptions: () => void;
  toggleSubscriptions: (value: 'DAILY' | 'DISABLED') => void;
  getLanguageVersion: (value: {
    data?: { [key: string]: string };
    lang: string;
    appendLocale?: boolean;
  }) => string;
}

export default function OwnInformation({
  user,
  organizations,
  requests,
  subscriptions,
  toggleSubscriptionsResult,
  renderPermissionModal,
  renderSubscriptionModal,
  refetchSubscriptions,
  toggleSubscriptions,
  getLanguageVersion,
}: OwnInformationProps) {
  const { t, i18n } = useTranslation('common');

  const handleToggleClick = () => {
    if (!subscriptions) {
      return;
    }

    toggleSubscriptions(
      subscriptions.subscriptionType === 'DAILY' ? 'DISABLED' : 'DAILY'
    );
  };

  const hasRequestPending = (organizationId: string) => {
    if (!requests) {
      return false;
    }

    return requests.some(
      (request) => request.organizationId === organizationId
    );
  };

  useEffect(() => {
    if (toggleSubscriptionsResult.isSuccess) {
      refetchSubscriptions();
    }
  }, [toggleSubscriptionsResult, refetchSubscriptions]);

  if (user.anonymous) {
    return null;
  }

  return (
    <>
      <Breadcrumb baseUrl={t('datamodel-title')}>
        <BreadcrumbLink url="/own-information" current>
          {t('own-information')}
        </BreadcrumbLink>
      </Breadcrumb>

      <PageContent>
        <Heading variant="h1">{t('own-information')}</Heading>

        <BasicBlock title={t('name')}>
          {`${user.firstName} ${user.lastName}`}
        </BasicBlock>
        <BasicBlock title={t('email-address')}>{user.email}</BasicBlock>

        <Separator isLarge />

        <BasicBlock
          title={t('organizations-and-roles')}
          largeGap
          id="organizations-and-roles"
        >
          <OrgsAndRolesWrapper>
            {Object.entries(user.rolesInOrganizations)
              .filter((data) =>
                organizations?.some((org) => org.id === data[0])
              )
              .map((data) => (
                <div key={data[0]}>
                  <BasicBlock title={t('organization')}>
                    {organizations
                      ? getLanguageVersion({
                          data: organizations.find((org) => org.id === data[0])
                            ?.label,
                          lang: i18n.language,
                          appendLocale: true,
                        })
                      : null}
                  </BasicBlock>

                  <BasicBlock title={t('roles.roles')}>
                    <OrgsAndRolesUl>
                      {data[1].map((role) => (
                        <li key={`${data[0]}-role-${role}`}>
                          {translateRole(role, t)}
                        </li>
                      ))}
                    </OrgsAndRolesUl>
                  </BasicBlock>

                  {hasRequestPending(data[0]) && (
                    <InlineAlert>{t('access-request-sent')}</InlineAlert>
                  )}
                </div>
              ))}
          </OrgsAndRolesWrapper>
        </BasicBlock>

        {renderPermissionModal({ organizations: organizations })}

        <Separator isLarge />

        <BasicBlock
          title={t('email-subscriptions')}
          id="email-notifications"
          extra={
            <BasicBlockExtraWrapper>
              <ToggleButton
                checked={subscriptions?.subscriptionType === 'DAILY' ?? false}
                onClick={() => handleToggleClick()}
              >
                {t('email-subscriptions')}
              </ToggleButton>
              <InlineAlert
                status={
                  subscriptions?.subscriptionType === 'DAILY'
                    ? 'neutral'
                    : 'warning'
                }
              >
                {subscriptions?.subscriptionType === 'DAILY'
                  ? t('email-subscriptions-on')
                  : t('email-subscriptions-off')}
              </InlineAlert>
            </BasicBlockExtraWrapper>
          }
        >
          {t('subscription-description')}
        </BasicBlock>

        <BasicBlock title={t('subscribed-items')}>
          {!subscriptions || subscriptions.resources?.length < 1 ? (
            <div>{t('no-subscribed-items')}</div>
          ) : (
            <>
              <SubscriptionsWrapper>
                {subscriptions.resources.map((r) => (
                  <div key={r.uri}>
                    <Link href={r.uri}>{r.uri}</Link>
                    {renderSubscriptionModal({
                      resourceIds: [r.uri],
                      singular: true,
                    })}
                  </div>
                ))}
              </SubscriptionsWrapper>

              <div id="remove-all-subscriptions-wrapper">
                {renderSubscriptionModal({
                  resourceIds: subscriptions.resources.map((r) => r.uri),
                })}
              </div>
            </>
          )}
        </BasicBlock>
      </PageContent>
    </>
  );
}
