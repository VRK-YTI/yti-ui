import {
  CommonContextProvider,
  CommonContextState,
} from 'yti-common-ui/common-context-provider';
import Layout from '@app/common/components/layout';
import { SSRConfig, useTranslation } from 'next-i18next';
import { createCommonGetServerSideProps } from '@app/common/utils/create-getserversideprops';
import {
  getOrganizations,
  getRunningQueriesThunk as getOrganizationsRunningQueriesThunk,
} from '@app/common/components/organizations/organizations.slice';
import {
  getServiceCategories,
  getRunningQueriesThunk as getServiceCategoriesRunningQueriesThunk,
} from '@app/common/components/service-categories/service-categories.slice';
import { initialUrlState } from 'yti-common-ui/utils/hooks/use-url-state';
import PageHead from 'yti-common-ui/page-head';
import {
  getCount,
  getRunningQueriesThunk as getCountRunningQueriesThunk,
} from '@app/common/components/counts/counts.slice';
import { MscrUser } from '@app/common/interfaces/mscr-user.interface';

interface IndexPageProps extends CommonContextState {
  _netI18Next: SSRConfig;
  user: MscrUser;
}

export default function IndexPage(props: IndexPageProps) {
  const { t } = useTranslation('common');

  return (
    <CommonContextProvider value={props}>
      <Layout
        user={props.user ?? undefined}
        fakeableUsers={props.fakeableUsers}
      >
        <PageHead
          baseUrl="https://tietomallit.suomi.fi"
          title={t('datamodel-title')}
          description={t('service-description')}
        />
        props.children
        {/*<FrontPage />*/}
      </Layout>
    </CommonContextProvider>
  );
}

export const getServerSideProps = createCommonGetServerSideProps(
  async ({ store, query, locale }) => {
    const urlState = Object.assign({}, initialUrlState);

    if (query) {
      if (query.q !== undefined) {
        urlState.q = Array.isArray(query.q) ? query.q[0] : query.q;
      }

      if (query.page !== undefined) {
        const pageValue = Array.isArray(query.page)
          ? parseInt(query.page[0], 10)
          : parseInt(query.page, 10);
        urlState.page = !isNaN(pageValue) ? pageValue : initialUrlState.page;
      }

      if (query.status !== undefined) {
        urlState.status = Array.isArray(query.status)
          ? query.status
          : [query.status];
      }

      if (query.types !== undefined) {
        urlState.types = Array.isArray(query.types)
          ? query.types
          : [query.types];
      }

      if (query.domain) {
        urlState.domain = Array.isArray(query.domain)
          ? query.domain
          : [query.domain];
      }

      if (query.organization) {
        urlState.organization = Array.isArray(query.organization)
          ? query.organization[0]
          : query.organization;
      }

      if (query.lang) {
        urlState.lang = Array.isArray(query.lang) ? query.lang[0] : query.lang;
      }
    }

    store.dispatch(getServiceCategories.initiate(locale ?? 'fi'));
    store.dispatch(getOrganizations.initiate(locale ?? 'fi'));
    store.dispatch(getCount.initiate());

    await Promise.all(
      store.dispatch(getServiceCategoriesRunningQueriesThunk())
    );
    await Promise.all(store.dispatch(getOrganizationsRunningQueriesThunk()));
    await Promise.all(store.dispatch(getCountRunningQueriesThunk()));

    return {};
  }
);
