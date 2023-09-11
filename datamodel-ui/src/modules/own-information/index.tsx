import { useTranslation } from 'next-i18next';
import { Breadcrumb, BreadcrumbLink } from 'yti-common-ui/breadcrumb';
import {
  OrgsAndRolesUl,
  OrgsAndRolesWrapper,
  PageContent,
} from './own-information.styles';
import { Heading } from 'suomifi-ui-components';
import { useSelector } from 'react-redux';
import { selectLogin } from '@app/common/components/login/login.slice';
import { BasicBlock } from 'yti-common-ui/block';
import Separator from 'yti-common-ui/separator';
import { useGetOrganizationsQuery } from '@app/common/components/organizations/organizations.slice';
import { getLanguageVersion } from '@app/common/utils/get-language-version';

export default function OwnInformation() {
  const user = useSelector(selectLogin());
  const { t, i18n } = useTranslation('common');
  const { data: organizations } = useGetOrganizationsQuery(i18n.language);
  // const { data: requests } = useGetRequestsQuery();

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
      </PageContent>
    </>
  );
}
