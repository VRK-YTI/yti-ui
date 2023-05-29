import UpdateWithFileModal from '@app/common/components/update-with-file-modal';
import { createCommonGetServerSideProps } from '@app/common/utils/create-getserversideprops';
import EditCollection from '@app/modules/edit-collection';
import SchemaCollection from '@app/modules/schema-collection';
import { SSRConfig, useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React from 'react';
import { Button, Paragraph, TextInput } from 'suomifi-ui-components';
import {
  CommonContextProvider,
  CommonContextState,
} from 'yti-common-ui/common-context-provider';
import Layout from 'yti-common-ui/layout/layout';
import Separator from 'yti-common-ui/separator';

interface SchemaIndexPageProps extends CommonContextState {
  _netI18Next: SSRConfig;
}

export default function Schemas(props: SchemaIndexPageProps) {
  const router = useRouter();
  const { t } = useTranslation('schema');

  const schemaFileUplaod = () => {
    // Open the modal for file chooser, may be new terminology modal can be used
    console.log('Upload the schema file');
  };

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
          labelText="Language Version"
          visualPlaceholder="Enter the language version"
        />
        <TextInput
          onBlur={(event) => console.log(event.target.value)}
          labelText="Filename"
          visualPlaceholder="filename for the schema"
        />
        <Separator isLarge />
        <Button onClick={() => schemaFileUplaod()} id="submit-button">
          {'Register schema'}
        </Button>
        <Separator isLarge />
        <UpdateWithFileModal />
        <h2> List of Schemas</h2>
        <EditCollection
          terminologyId={'1'}
          collectionName={'Schema Collection'}
        ></EditCollection>
      </Layout>
    </CommonContextProvider>
  );
}

export const getServerSideProps = createCommonGetServerSideProps();
