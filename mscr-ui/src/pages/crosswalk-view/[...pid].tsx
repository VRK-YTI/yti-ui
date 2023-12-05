import {
  CommonContextProvider,
  CommonContextState,
} from 'yti-common-ui/common-context-provider';
import Layout from 'yti-common-ui/layout/layout';
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
import UpdateWithFileModal from '@app/common/components/update-with-file-modal';
import Separator from 'yti-common-ui/components/separator';
import { Crosswalk } from '@app/common/interfaces/crosswalk.interface';
import { useGetCrosswalkQuery } from '@app/common/components/crosswalk/crosswalk.slice';
import { Paragraph } from 'suomifi-ui-components';

interface IndexPageProps extends CommonContextState {
  _netI18Next: SSRConfig;
  schemaId: string;
}

export default function SchemaPage(props: IndexPageProps) {
    console.log('PAGE PROPS', props)
  const { query, asPath } = useRouter();
  const crosswalkId = (query?.pid ?? '') as string;
  let crosswalk: Crosswalk;

  const { data, isLoading, isSuccess, isError, error } =
        useGetCrosswalkQuery(crosswalkId);

  function renderSchema() {
    let crosswalkContent;
    if (isLoading) {
      crosswalkContent = (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      );
    } else if (isSuccess) {
      crosswalk = data;
      crosswalkContent = (
        <div className="col-lg-12 mb-3 ">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Crosswalk PID:{crosswalk.pid}</h5>
              <ul>
                <h5>Description</h5>
                <li>{crosswalk.description?.fi}</li>
                <li>{crosswalk.description?.en}</li>
                <li>{crosswalk.description?.sv}</li>
              </ul>
              <Paragraph>
                <label>Source Schema:{crosswalk.sourceSchema}</label>
                <label>Target Schema:{crosswalk.targetSchema}</label>
                <label>Status: {crosswalk.status}</label>
              </Paragraph>
            </div>
          </div>
          <Separator />
          <UpdateWithFileModal
            pid={crosswalkId}
            refetch={function (): void {
              throw new Error('Function not implemented.');
            }}
          />
          <Separator />
        </div>
      );
    }

    return crosswalkContent;
  }

  return (
    <CommonContextProvider value={props}>
      <Layout
        user={props.user ?? undefined}
        fakeableUsers={props.fakeableUsers}
      >
        {renderSchema()}
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
