import { SSRConfig, useTranslation } from 'next-i18next';
import { useRouter } from 'next/dist/client/router';
import React, { useState } from 'react';
import Layout from '../../../../layouts/layout';
import Head from 'next/head';
import { createCommonGetServerSideProps } from '../../../../common/utils/create-getserversideprops';
import User from '../../../../common/interfaces/user-interface';
import useUser from '../../../../common/utils/hooks/useUser';
import Concept from '../../../../modules/concept';
import { MediaQueryContextProvider } from '../../../../common/components/media-query/media-query-context';

// TODO: perhaps move the component itself to components/
export default function ConceptPage(props: {
  _netI18Next: SSRConfig;
  user: User;
  isSSRMobile: boolean;
}) {
  const { t } = useTranslation('common');
  const { user, } = useUser({ initialData: props.user });
  const { query } = useRouter();
  const terminologyId = (query?.terminologyId ?? '') as string;
  const conceptId = (query?.conceptId ?? '') as string;
  const [conceptTitle, setConceptTitle] = useState('');

  return (
    <MediaQueryContextProvider value={{ isSSRMobile: props.isSSRMobile }}>
      {/* todo: use better feedbackSubject once more data is available */}
      <Layout user={user} feedbackSubject={`${t('concept-id')} ${conceptId}`}>
        <Head>
          <title>{conceptTitle} | {t('terminology-site-title')} | {t('interoperability-platform')}</title>
        </Head>

        <Concept terminologyId={terminologyId} conceptId={conceptId} setConceptTitle={setConceptTitle}/>
      </Layout>
    </MediaQueryContextProvider>
  );
}

export const getServerSideProps = createCommonGetServerSideProps();
