import { Heading } from 'suomifi-ui-components';
import { Breadcrumb, BreadcrumbLink } from '../../common/components/breadcrumb';
import { useTranslation } from 'next-i18next';
import {
  HeadingBlock,
  MainContent,
  OrganizationAndRoles,
  OrganizationAndRolesHeading,
  OrganizationAndRolesItem,
  OrganizationAndRolesWrapper,
  PageContent,
} from './own-information.styles';
import { useBreakpoints } from '../../common/components/media-query/media-query-context';
import { useEffect, useRef } from 'react';
import { BasicBlock } from '../../common/components/block';
import { useSelector } from 'react-redux';
import { selectLogin } from '../../common/components/login/login-slice';
import Separator from '../../common/components/separator';
import { useGetOrganizationsQuery } from '../../common/components/terminology-search/terminology-search-slice';
import { getPropertyValue } from '../../common/components/property-value/get-property-value';
import _ from 'lodash';
import SubscriptionBlock from './subscription-block';
import EmailNotificationsBlock from './email-notifications-block';
import { useGetSubscriptionsQuery } from '../../common/components/subscription/subscription-slice';

export default function OwnInformation() {
  const user = useSelector(selectLogin());
  const { breakpoint } = useBreakpoints();
  const { t, i18n } = useTranslation('own-information');
  const { data: organizations } = useGetOrganizationsQuery(i18n.language);
  const { data: subscriptions, refetch: refetchSubscriptions } = useGetSubscriptionsQuery(null);

  const titleRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.focus();
    }
  }, [titleRef]);

  if (user.anonymous) {
    return null;
  }

  return (
    <>
      <Breadcrumb>
        <BreadcrumbLink url="/own-information" current>
          {t('own-information')}
        </BreadcrumbLink>
      </Breadcrumb>

      <PageContent breakpoint={breakpoint}>
        <MainContent id="main">
          <HeadingBlock>
            <Heading variant="h1" tabIndex={-1} ref={titleRef}>
              {t('own-information')}
            </Heading>
          </HeadingBlock>

          <BasicBlock title={<h2>{t('field-name')}</h2>}>
            {`${user.firstName} ${user.lastName}`}
          </BasicBlock>
          <BasicBlock title={<h2>{t('field-email')}</h2>}>
            {user.email}
          </BasicBlock>

          <Separator isLarge />

          <BasicBlock
            title={<h2>{t('field-organizations-and-roles')}</h2>}
            largeGap
          >
            {renderOrganizationsAndRoles()}
          </BasicBlock>

          <Separator isLarge />

          {
            subscriptions
            &&
            <>
              <EmailNotificationsBlock subscriptions={subscriptions} refetchSubscriptions={refetchSubscriptions} />
              <SubscriptionBlock subscriptions={subscriptions} />
            </>
          }
        </MainContent>
      </PageContent>
    </>
  );

  function renderOrganizationsAndRoles() {
    const organizationsAndRoles = getOrganizationsAndRoles();

    if (!organizationsAndRoles.length) return null;

    return (
      <OrganizationAndRolesWrapper>
        {organizationsAndRoles.map(({ organization, roles }) => {
          return (
            <OrganizationAndRoles key={organization.id}>
              <OrganizationAndRolesItem>
                <OrganizationAndRolesHeading>
                  {t('organization')}
                </OrganizationAndRolesHeading>
                <div>{organization.name}</div>
              </OrganizationAndRolesItem>

              <OrganizationAndRolesItem>
                <OrganizationAndRolesHeading>
                  {t('roles')}
                </OrganizationAndRolesHeading>
                <ul>
                  {roles.map((role) => (
                    <li key={role}>{t(role, { ns: 'common' })}</li>
                  ))}
                </ul>
              </OrganizationAndRolesItem>
            </OrganizationAndRoles>
          );
        })}
      </OrganizationAndRolesWrapper>
    );
  }

  function getOrganizationsAndRoles() {
    const result = Object.entries(user.rolesInOrganizations).map(
      ([organizationId, roles]) => {
        return {
          organization: {
            id: organizationId,
            name: getOrganizationName(organizationId),
          },
          roles,
        };
      }
    );

    return _.sortBy(result, 'organization.name');
  }

  function getOrganizationName(id: string): string {
    return (
      getPropertyValue({
        property: organizations
          ?.filter((organization) => organization.id === id)
          .map((organization) => organization.properties.prefLabel),
        language: i18n.language,
        fallbackLanguage: 'fi',
      }) ?? ''
    );
  }
}
