import { SSRConfig, useTranslation } from 'next-i18next';
import { useRouter } from 'next/dist/client/router';
import React from 'react';
import Layout from '../../../../layouts/layout';
import Head from 'next/head';
import { createCommonGetServerSideProps } from '../../../../common/utils/create-getserversideprops';
import User from '../../../../common/interfaces/user-interface';
import useUser from '../../../../common/utils/hooks/useUser';
import { MediaQueryContextProvider } from '../../../../common/components/media-query/media-query-context';
import Collection from '../../../../modules/collection';

// TODO: perhaps move the component itself to components/
export default function CollectionPage(props: {
  _netI18Next: SSRConfig;
  user: User;
  isSSRMobile: boolean;
}) {
  const { t } = useTranslation('common');
  const { user, } = useUser({ initialData: props.user });
  const { query } = useRouter();
  const terminologyId = (query?.terminologyId ?? '') as string;
  const collectionId = (query?.collectionId ?? '') as string;

  return (
    <MediaQueryContextProvider value={{ isSSRMobile: props.isSSRMobile }}>
      {/* todo: use better feedbackSubject once more data is available */}
      <Layout user={user} feedbackSubject={`${t('collection-id')} ${collectionId}`}>
        <Head>
          <title>{ t('collection-title') }</title>
        </Head>

        <Collection terminologyId={terminologyId} collectionId={collectionId} />
      </Layout>
    </MediaQueryContextProvider>
  );
}

export const getServerSideProps = createCommonGetServerSideProps();
