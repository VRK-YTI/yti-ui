import { SSRConfig, useTranslation } from 'next-i18next';
import { useRouter } from 'next/dist/client/router';
import React from 'react';
import Layout from '../../layouts/layout';
import Head from 'next/head';
import { createCommonGetServerSideProps } from '../../common/utils/create-getserversideprops';
import User from '../../common/interfaces/user-interface';
import useUser from '../../common/utils/hooks/useUser';
import Vocabulary from '../../modules/vocabulary';
import { MediaQueryContextProvider } from '../../common/components/media-query/media-query-context';

// TODO: perhaps move the component itself to components/
export default function TerminologyPage(props: {
  _netI18Next: SSRConfig;
  user: User;
  isSSRMobile: boolean;
}) {
  const { t } = useTranslation('common');
  const { user, } = useUser({ initialData: props.user });
  const { query } = useRouter();
  const terminologyId = (query?.terminologyId ?? '') as string;

  return (
    <MediaQueryContextProvider value={{ isSSRMobile: props.isSSRMobile }}>
      {/* todo: use better feedbackSubject once more data is available */}
      <Layout user={user} feedbackSubject={`${t('terminology-id')} ${terminologyId}`}>
        <Head>
          <title>{ t('terminology-title') }</title>
        </Head>

        <Vocabulary id={terminologyId}/>
      </Layout>
    </MediaQueryContextProvider>
  );
}

export const getServerSideProps = createCommonGetServerSideProps();
