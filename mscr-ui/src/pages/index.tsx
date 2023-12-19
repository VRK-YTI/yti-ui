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
import useUrlState, {
  initialUrlState,
} from '@app/common/utils/hooks/use-url-state';
import {
  getCount,
  getRunningQueriesThunk as getCountRunningQueriesThunk,
} from '@app/common/components/counts/counts.slice';
import PageHead from 'yti-common-ui/page-head';
import { MscrUser } from '@app/common/interfaces/mscr-user.interface';
import SiteInformationModule from '@app/modules/site-information';
import SearchBar from 'src/modules/search/search-bar';
import { Grid } from '@mui/material';

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
          baseUrl="https://mscr-test.rahtiapp.fi"
          title={t('mscr-title')}
          description={t('service-description')}
        />
        <Grid container alignItems="center">
          <Grid item xs={6}>
            <SiteInformationModule />
          </Grid>
          <Grid item xs={6}>
            <div>
              <p>Search in MSCR</p>
              <SearchBar placeholder={t('landing.search-placeholder')} />
            </div>
          </Grid>
        </Grid>
      </Layout>
    </CommonContextProvider>
  );
}

//CreateCommonGetSevverside Props creat
export const getServerSideProps = createCommonGetServerSideProps(
  async ({ store, query, locale }) => {
    const urlState = Object.assign({}, initialUrlState);

    if (query) {
      if (query.q !== undefined) {
        urlState.q = Array.isArray(query.q) ? query.q[0] : query.q;
      }
      // console.log('server side props are ' + query);

      if (query.page !== undefined) {
        const pageValue = Array.isArray(query.page)
          ? parseInt(query.page[0], 10)
          : parseInt(query.page, 10);
        urlState.page = !isNaN(pageValue) ? pageValue : initialUrlState.page;
      }

      if (query.state !== undefined) {
        urlState.state = Array.isArray(query.state)
          ? query.state
          : [query.state];
      }

      if (query.type !== undefined) {
        urlState.type = Array.isArray(query.type) ? query.type : [query.type];
      }

      if (query.organization !== undefined) {
        urlState.organization = Array.isArray(query.organization)
          ? query.organization
          : [query.organization];
      }

      if (query.format !== undefined) {
        urlState.format = Array.isArray(query.format)
          ? query.format
          : [query.format];
      }

      if (query.sourceType !== undefined) {
        urlState.sourceType = Array.isArray(query.sourceType)
          ? query.sourceType
          : [query.sourceType];
      }

      if (query.sourceSchema !== undefined) {
        urlState.sourceSchema = Array.isArray(query.sourceSchema)
          ? query.sourceSchema
          : [query.sourceSchema];
      }

      if (query.targetSchema !== undefined) {
        urlState.targetSchema = Array.isArray(query.targetSchema)
          ? query.targetSchema
          : [query.targetSchema];
      }

      if (query.lang) {
        urlState.lang = Array.isArray(query.lang) ? query.lang[0] : query.lang;
      }
    }

    store.dispatch(getServiceCategories.initiate(locale ?? 'fi'));
    store.dispatch(getOrganizations.initiate(locale ?? 'en'));
    store.dispatch(getCount.initiate());

    await Promise.all(
      store.dispatch(getServiceCategoriesRunningQueriesThunk())
    );
    await Promise.all(store.dispatch(getOrganizationsRunningQueriesThunk()));
    await Promise.all(store.dispatch(getCountRunningQueriesThunk()));

    return {};
  }
);
