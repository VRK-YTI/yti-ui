import EditCollection from '@app/modules/edit-collection';
import { FormTitle } from '@app/modules/edit-vocabulary/edit-vocabulary.styles';
import { PageContent } from '@app/modules/own-information/own-information.styles';
import { SSRConfig } from 'next-i18next';
import React from 'react';
import {
  CommonContextProvider,
  CommonContextState,
} from 'yti-common-ui/common-context-provider';
import Layout from 'yti-common-ui/layout/layout';

interface SchemaIndexPageProps extends CommonContextState {
  _netI18Next: SSRConfig;
}

export default function Schemas(props: SchemaIndexPageProps) {
  return (
    <CommonContextProvider value={props}>
      <Layout user={props.user} fakeableUsers={props.fakeableUsers}>
        <FormTitle></FormTitle>
        <h2> List of Schemas</h2>
        <EditCollection
          terminologyId={'1'}
          collectionName={'First Schema'}
        ></EditCollection>
      </Layout>
    </CommonContextProvider>
  );
}
