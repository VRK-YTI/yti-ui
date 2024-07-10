import {
  CommonContextProvider,
  CommonContextState,
} from 'yti-common-ui/common-context-provider';
import Layout from '@app/common/components/layout';
import { SSRConfig } from 'next-i18next';
import { createCommonGetServerSideProps } from '@app/common/utils/create-getserversideprops';
import { useRouter } from 'next/router';
import { MscrUser } from '@app/common/interfaces/mscr-user.interface';
import SchemaView from '@app/modules/schema-view';

interface IndexPageProps extends CommonContextState {
  _netI18Next: SSRConfig;
  user: MscrUser;
  schemaId: string;
}

export default function SchemaPage(props: IndexPageProps) {
  const { query } = useRouter();
  const schemaId = (query?.pid ?? [''])[0];

  return (
    <CommonContextProvider value={props}>
      <Layout
        user={props.user ?? undefined}
        fakeableUsers={props.fakeableUsers}
      >
        <SchemaView schemaId={schemaId} />
      </Layout>
    </CommonContextProvider>
  );
}

export const getServerSideProps = createCommonGetServerSideProps();
