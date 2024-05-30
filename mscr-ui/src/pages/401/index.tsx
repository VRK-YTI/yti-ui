import {
  CommonContextProvider,
  CommonContextState,
} from 'yti-common-ui/components/common-context-provider';
import { SSRConfig, useTranslation } from 'next-i18next';
import PageHead from 'yti-common-ui/components/page-head';
import Layout from '@app/common/components/layout';
import { MscrUser } from '@app/common/interfaces/mscr-user.interface';
import { createCommonGetServerSideProps } from '@app/common/utils/create-getserversideprops';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

interface unauthorizedPageProps extends CommonContextState {
  _netI18Next: SSRConfig;
  user: MscrUser;
}



export default function UnauthorizedPage(props: unauthorizedPageProps) {
  useEffect(() => {
    if (props && !props.user.anonymous) {
      router.push('/');
    }
  }, [props]);

  const { t } = useTranslation('common');
  const router = useRouter();

  return (
    <CommonContextProvider value={props}>
      <Layout
        user={props.user ?? undefined}
        fakeableUsers={props.fakeableUsers}
        sideNavigationHidden={true}
      >
        <PageHead
          baseUrl="https://mscr-test.rahtiapp.fi"
          title={t('mscr-title')}
          description={t('service-description')}
        />
        <p>You need to be logged in to view this content</p>
      </Layout>
    </CommonContextProvider>
  );
}

export const getServerSideProps = createCommonGetServerSideProps();
