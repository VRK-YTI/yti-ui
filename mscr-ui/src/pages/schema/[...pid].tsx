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
import { useGetSchemaQuery } from '@app/common/components/schema/schema.slice';
import { Schema } from '@app/common/interfaces/schema.interface';
import UpdateWithFileModal from '@app/common/components/update-with-file-modal';
import Separator from 'yti-common-ui/components/separator';
import { BasicBlock, BasicBlockExtraWrapper } from 'yti-common-ui/block';
import { MscrUser } from '@app/common/interfaces/mscr-user.interface';

interface IndexPageProps extends CommonContextState {
  _netI18Next: SSRConfig;
  user: MscrUser;
  schemaId: string;
}

// Example schema metadata
/*
{
  "created": "2023-11-17T12:52:59.337Z",
  "modified": "2023-11-17T12:52:59.337Z",
  "modifier": {
    "id": "4ce70937-6fa4-49af-a229-b5f10328adb8",
    "name": "fake user"
  },
  "creator": {
    "id": "4ce70937-6fa4-49af-a229-b5f10328adb8",
    "name": "fake user"
  },
  "type": null,
  "prefix": null,
  "status": "DRAFT",
  "label": {
    "en": "duwdu gwdf wugedwu"
  },
  "description": {
    "en": "wuey bwuey wyue"
  },
  "languages": [
    "en"
  ],
  "organizations": [
    {
      "id": "7d3a3c00-5a6b-489b-a3ed-63bb58c26a63",
      "label": {
        "fi": "Yhteentoimivuusalustan yllapito",
        "sv": "Utvecklare av interoperabilitetsplattform",
        "en": "Interoperability platform developers"
      },
      "parentOrganization": null
    }
  ],
  "groups": [],
  "internalNamespaces": [],
  "externalNamespaces": [],
  "terminologies": [],
  "codeLists": [],
  "contact": null,
  "documentation": {},
  "state": "DRAFT",
  "visibility": "PUBLIC",
  "format": "JSONSCHEMA",
  "namespace": "http://test.com",
  "versionLabel": "1",
  "revisionOf": null,
  "aggregationKey": "urn:IAMNOTAPID:e68ce802-38a0-4c6f-ba2d-41ad11561080",
  "hasRevisions": null,
  "revisions": null,
  "variants": null,
  "variants2": null,
  "owner": [
    "7d3a3c00-5a6b-489b-a3ed-63bb58c26a63"
  ],
  "fileMetadata": [],
  "pid": "urn:IAMNOTAPID:e68ce802-38a0-4c6f-ba2d-41ad11561080"
}
*/
export default function SchemaPage(props: IndexPageProps) {
  const { query, asPath } = useRouter();
  const schemaId = (query?.pid ?? '') as string;
  const items: Schema[] = [];

  const { data, isLoading, isSuccess, isError, error } =
    useGetSchemaQuery(schemaId);

 
  function renderSchema() {
    let schemaContent;
    if (isLoading) {
      schemaContent = (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      );
    } else if (isSuccess) {
      items.push(data);
      schemaContent = (
        <div className="col-lg-12 mb-3 ">
          <div className="card">
            <div className="card-body">
              <BasicBlock title={'Schema Name'}>
                {data.label?.en}
              </BasicBlock>
              <BasicBlock title={'Schema Name'}>
                {data.description?.en}
              </BasicBlock>
              <BasicBlock title={'Schema created'}>{data.created}</BasicBlock>
              <BasicBlock title={'Schema Visibilty'}>
                {data.visibility}
              </BasicBlock>
              <BasicBlock title={'Schema Version'}>
                {data.versionLabel}
              </BasicBlock>
              <BasicBlock title={'Schema Status'}>{data.status}</BasicBlock>
              <BasicBlock title={'Schema format'}>{data.format}</BasicBlock>
            </div>
          </div>
          <Separator />
          <BasicBlockExtraWrapper>
            <UpdateWithFileModal
              pid={schemaId}
              refetch={function (): void {
                throw new Error('Function not implemented.');
              }}
            />
          </BasicBlockExtraWrapper>
        </div>
      );
    }

    return schemaContent;
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
