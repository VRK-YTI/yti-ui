import {
  CommonContextProvider,
  CommonContextState,
} from 'yti-common-ui/common-context-provider';
import Layout from '@app/common/components/layout';
import { SSRConfig } from 'next-i18next';
import { createCommonGetServerSideProps } from '@app/common/utils/create-getserversideprops';
import { useRouter } from 'next/router';
import { MscrUser } from '@app/common/interfaces/mscr-user.interface';
import CrosswalkEditor from '@app/modules/crosswalk-editor';

interface IndexPageProps extends CommonContextState {
  _netI18Next: SSRConfig;
  user: MscrUser;
  schemaId: string;
}

export default function CrosswalkPage(props: IndexPageProps) {
  const { query } = useRouter();
  const crosswalkId = (query?.pid ?? [''])[0];

  return (
    <CommonContextProvider value={props}>
      <Layout
        user={props.user ?? undefined}
        sideNavigationHidden={true}
        fakeableUsers={props.fakeableUsers}
      >
        <CrosswalkEditor crosswalkId={crosswalkId} />
      </Layout>
    </CommonContextProvider>
  );
}

export const getServerSideProps = createCommonGetServerSideProps();
