import InfoExpander from '@app/common/components/info-dropdown/info-expander';
import UpdateWithFileModal from '@app/common/components/update-with-file-modal';
import { createCommonGetServerSideProps } from '@app/common/utils/create-getserversideprops';
import EditCollection from '@app/modules/edit-collection';
import { SSRConfig } from 'next-i18next';
import React from 'react';
import { Button, TextInput } from 'suomifi-ui-components';
import {
  CommonContextProvider,
  CommonContextState,
} from 'yti-common-ui/common-context-provider';
import Layout from 'yti-common-ui/layout/layout';
import Separator from 'yti-common-ui/separator';

interface CrosswalkPageProps extends CommonContextState {
  _netI18Next: SSRConfig;
}

export default function Crosswalk(props: CrosswalkPageProps) {
  const crosswalkFileUplaod = () => {
    console.log('Update Crosswalk information');
  };

  return (
    <CommonContextProvider value={props}>
      <Layout user={props.user} fakeableUsers={props.fakeableUsers}>
        <h2>Add New Crosswalk</h2>
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
        <Separator isLarge />
        <Button onClick={() => crosswalkFileUplaod()} id="submit-button">
          {'Register Crosswalks'}
        </Button>
        <Separator isLarge />
        <UpdateWithFileModal />
        <h2> List of Croswalks</h2>
        <EditCollection
          terminologyId={'1'}
          collectionName={'first crosswalk'}
        ></EditCollection>
      </Layout>
    </CommonContextProvider>
  );
}

export const getServerSideProps = createCommonGetServerSideProps();
