import { Breadcrumb, BreadcrumbLink } from '@app/common/components/breadcrumb';
import { useTranslation } from 'next-i18next';
import {
  MainContent,
  OrganizationAndRoles,
  OrganizationAndRolesHeading,
  OrganizationAndRolesItem,
  OrganizationAndRolesWrapper,
  PageContent,
} from './own-information.styles';
import { useBreakpoints } from '@app/common/components/media-query/media-query-context';
import { BasicBlock } from '@app/common/components/block';
import { useSelector } from 'react-redux';
import { selectLogin } from '@app/common/components/login/login.slice';
import Separator from '@app/common/components/separator';
import { useGetOrganizationsQuery } from '@app/common/components/terminology-search/terminology-search.slice';
import { getPropertyValue } from '@app/common/components/property-value/get-property-value';
import { sortBy } from 'lodash';
import AccessRequest from '../../common/components/access-request';
import SubscriptionBlock from './subscription-block';
import EmailNotificationsBlock from './email-notifications-block';
import { useGetSubscriptionsQuery } from '../../common/components/subscription/subscription.slice';
import InlineAlert from '@app/common/components/inline-alert';
import { useGetRequestsQuery } from '@app/common/components/access-request/access-request.slice';
import { MainTitle } from '@app/common/components/title-block';

export default function OwnInformation() {
  const user = useSelector(selectLogin());
  const { breakpoint } = useBreakpoints();
  const { t, i18n } = useTranslation('own-information');
  const { data: organizations } = useGetOrganizationsQuery(i18n.language);
  const { data: subscriptions, refetch: refetchSubscriptions } =
    useGetSubscriptionsQuery(null);
  const { data: requests } = useGetRequestsQuery(null);

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

      <PageContent $breakpoint={breakpoint}>
        <MainContent id="main">
          <MainTitle>{t('own-information')}</MainTitle>

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

          <BasicBlock>
            <AccessRequest organizations={organizations} />
          </BasicBlock>

          <Separator isLarge />

          <EmailNotificationsBlock
            subscriptions={subscriptions}
            refetchSubscriptions={refetchSubscriptions}
          />

          {subscriptions && (
            <SubscriptionBlock
              subscriptions={subscriptions}
              refetchSubscriptions={refetchSubscriptions}
            />
          )}
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

              {requests
                ?.map((request) => request.organizationId)
                .includes(organization.id) ? (
                <InlineAlert
                  noIcon
                  style={{ marginBottom: '5px', marginTop: '20px' }}
                >
                  {t('access-request-sent')}
                </InlineAlert>
              ) : (
                <></>
              )}
            </OrganizationAndRoles>
          );
        })}
      </OrganizationAndRolesWrapper>
    );
  }

  function getOrganizationsAndRoles() {
    let result = Object.entries(user.rolesInOrganizations).map(
      ([organizationId, roles]) => {
        const requestedRoles =
          requests?.filter((request) => {
            if (request.organizationId === organizationId) {
              return request.role;
            }
          })?.[0]?.role ?? [];

        if (requestedRoles) {
          roles = roles.concat(requestedRoles);
        }

        return {
          organization: {
            id: organizationId,
            name: getOrganizationName(organizationId),
          },
          roles,
        };
      }
    );

    requests?.forEach((request) => {
      if (
        !result ||
        !result?.map((r) => r.organization.id).includes(request.organizationId)
      ) {
        result = result.concat({
          organization: {
            id: request.organizationId,
            name: getOrganizationName(request.organizationId),
          },
          roles: request.role,
        });
      }
    });

    return sortBy(result, 'organization.name');
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
