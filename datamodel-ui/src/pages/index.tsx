import {
  CommonContextProvider,
  CommonContextState,
} from 'yti-common-ui/common-context-provider';
import Layout from 'yti-common-ui/layout/layout';
import { SSRConfig } from 'next-i18next';
import { createCommonGetServerSideProps } from '@app/common/utils/create-getserversideprops';
import FrontPage from '@app/modules/front-page';
import {
  getOrganizations,
  getRunningQueriesThunk as getOrganizationsRunningQueriesThunk,
} from '@app/common/components/organizations/organizations.slice';
import {
  getServiceCategories,
  getRunningQueriesThunk as getServiceCategoriesRunningQueriesThunk,
} from '@app/common/components/serviceCategories/serviceCategories.slice';
import {
  getSearchModels,
  getRunningQueriesThunk as getSearchModelsRunningQueriesThunk,
} from '@app/common/components/searchModels/searchModels.slice';

interface IndexPageProps extends CommonContextState {
  _netI18Next: SSRConfig;
}

export default function IndexPage(props: IndexPageProps) {
  return (
    <CommonContextProvider value={props}>
      <Layout>
        <FrontPage />
      </Layout>
    </CommonContextProvider>
  );
}

export const getServerSideProps = createCommonGetServerSideProps(
  async ({ store }) => {
    store.dispatch(getServiceCategories.initiate());
    store.dispatch(getOrganizations.initiate());
    store.dispatch(getSearchModels.initiate());

    await Promise.all(
      store.dispatch(getServiceCategoriesRunningQueriesThunk())
    );
    await Promise.all(store.dispatch(getOrganizationsRunningQueriesThunk()));
    await Promise.all(store.dispatch(getSearchModelsRunningQueriesThunk()));

    return {};
  }
);
