import EditCollection from '@app/modules/edit-collection';
import { SSRConfig } from 'next-i18next';
import React from 'react';
import { Button, Paragraph, TextInput } from 'suomifi-ui-components';
import {
  CommonContextProvider,
  CommonContextState,
} from 'yti-common-ui/common-context-provider';
import Layout from 'yti-common-ui/layout/layout';

interface SchemaIndexPageProps extends CommonContextState {
  _netI18Next: SSRConfig;
}

const schemaFileUplaod = () => {
  // Open the modal for file chooser, may be concept import modal can be used
  console.log('Upload the schema file');
};

export default function Schemas(props: SchemaIndexPageProps) {
  return (
    <CommonContextProvider value={props}>
      <Layout user={props.user} fakeableUsers={props.fakeableUsers}>
        <h2>Add New Schema Metadata</h2>
        <TextInput
          onBlur={(event) => console.log(event.target.value)}
          labelText="Name"
          visualPlaceholder="input a name for the schema"
        />
        <TextInput
          onBlur={(event) => console.log(event.target.value)}
          labelText="Description"
          visualPlaceholder="Description of the schema"
        />
        <TextInput
          onBlur={(event) => console.log(event.target.value)}
          labelText="Filename"
          visualPlaceholder="filename for the schema"
        />
        <Paragraph>
          <Button onClick={() => schemaFileUplaod()} id="submit-button">
            {'Register schema'}
          </Button>
        </Paragraph>

        <h2> List of Schemas</h2>
        <EditCollection
          terminologyId={'1'}
          collectionName={'First Schema'}
        ></EditCollection>
      </Layout>
    </CommonContextProvider>
  );
}
