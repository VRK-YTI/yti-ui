import {
  CommonContextProvider,
  CommonContextState,
} from 'yti-common-ui/common-context-provider';
import Layout from '@app/common/components/layout';
import { SSRConfig } from 'next-i18next';
import { createCommonGetServerSideProps } from '@app/common/utils/create-getserversideprops';
import {
  getServiceCategories,
  getRunningQueriesThunk as getServiceQueriesThunk,
} from '@app/common/components/service-categories/service-categories.slice';
import {
  getOrganizations,
  getRunningQueriesThunk as getOrgQueriesThunk,
} from '@app/common/components/organizations/organizations.slice';
import { getRunningQueriesThunk as getInternalResourcesRunningQueriesThunk } from '@app/common/components/search-internal-resources/search-internal-resources.slice';
import { getRunningQueriesThunk as getVisualizationRunningQueriesThunk } from '@app/common/components/visualization/visualization.slice';
import { useRouter } from 'next/router';
import { MscrUser } from '@app/common/interfaces/mscr-user.interface';
import SchemaView from '@app/modules/schema-view';
import CrosswalkEditor from "@app/modules/crosswalk-editor";

interface IndexPageProps extends CommonContextState {
  _netI18Next: SSRConfig;
  user: MscrUser;
  schemaId: string;
}

export default function SchemaPage(props: IndexPageProps) {
  const { query, } = useRouter();
  const crosswalkId = (query?.pid ?? '') as string;

  return (
    <CommonContextProvider value={props}>
      <Layout
        user={props.user ?? undefined}
        fakeableUsers={props.fakeableUsers}
      >
        <CrosswalkEditor crosswalkId={crosswalkId} />
      </Layout>
    </CommonContextProvider>
  );
}

export const getServerSideProps = createCommonGetServerSideProps(
  async ({ store, query, locale }) => {
    store.dispatch(getServiceCategories.initiate(locale ?? 'fi'));
    store.dispatch(getOrganizations.initiate(locale ?? 'fi'));

    await Promise.all(store.dispatch(getServiceQueriesThunk()));
    await Promise.all(store.dispatch(getOrgQueriesThunk()));
    await Promise.all(
      store.dispatch(getInternalResourcesRunningQueriesThunk())
    );
    await Promise.all(store.dispatch(getVisualizationRunningQueriesThunk()));

    return {
      props: {},
    };
  }
);
