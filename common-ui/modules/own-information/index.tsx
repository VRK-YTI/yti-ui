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
import PermissionModal from './permission-modal';
import { User } from '../../interfaces/user.interface';
import { Organization } from '../../interfaces/organization.interface';
import { Request } from '../../interfaces/request.interface';
import { Subscriptions } from '../../interfaces/subscription.interface';
import { useEffect } from 'react';

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

  useEffect(() => {
    if (toggleSubscriptionsResult.isSuccess) {
      refetchSubscriptions();
    }
  }, [toggleSubscriptionsResult, refetchSubscriptions]);

  console.log('user', user);
  console.log('organizations', organizations);
  console.log('requests', requests);
  console.log('subscriptions', subscriptions);

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
          title="Organisaatiot ja roolit"
          largeGap
          id="organizations-and-roles"
        >
          <OrgsAndRolesWrapper>
            {Object.entries(user.rolesInOrganizations).map((data) => (
              <div key={data[0]}>
                <BasicBlock title="Organisaatio">
                  {organizations
                    ? getLanguageVersion({
                        data: organizations.find((org) => org.id === data[0])
                          ?.label,
                        lang: i18n.language,
                        appendLocale: true,
                      })
                    : null}
                </BasicBlock>

                <BasicBlock title="Roolit">
                  <OrgsAndRolesUl>
                    {data[1].map((role) => (
                      <li key={`${data[0]}-role-${role}`}>{role}</li>
                    ))}
                  </OrgsAndRolesUl>
                </BasicBlock>
              </div>
            ))}
          </OrgsAndRolesWrapper>
        </BasicBlock>

        <PermissionModal
          organizations={organizations}
          getLanguageVersion={getLanguageVersion}
        />

        <Separator isLarge />

        <BasicBlock
          title="Sähköposti-ilmoitukset"
          id="email-notifications"
          extra={
            <BasicBlockExtraWrapper>
              <ToggleButton
                checked={subscriptions?.subscriptionType === 'DAILY' ?? false}
                onClick={() => handleToggleClick()}
              >
                Sähköposti-ilmoitukset
              </ToggleButton>
              <InlineAlert
                status={
                  subscriptions?.subscriptionType === 'DAILY'
                    ? 'neutral'
                    : 'warning'
                }
              >
                {subscriptions?.subscriptionType === 'DAILY'
                  ? 'Sähköposti-ilmoitukset päällä'
                  : 'Sähköposti-ilmoitukset pois päältä'}
              </InlineAlert>
            </BasicBlockExtraWrapper>
          }
        >
          Kun ilmoitustoiminto on päällä, saat ilmoitukset muutoksista kerran
          päivässä. Voit halutessasi laittaa ilmoitustoiminnon pois päältä,
          jolloin et saa ilmoituksia sähköpostiisi.
        </BasicBlock>

        <BasicBlock title="Sanastoaineistot, joista on tilattu ilmoitukset">
          {!subscriptions || subscriptions.resources?.length < 1 ? (
            <div>Ei tilattuja aineistoja</div>
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
