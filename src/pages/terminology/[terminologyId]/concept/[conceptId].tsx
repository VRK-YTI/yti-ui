import { SSRConfig, useTranslation } from 'next-i18next';
import { useRouter } from 'next/dist/client/router';
import React, { useState } from 'react';
import Layout from '../../../../layouts/layout';
import Head from 'next/head';
import { createCommonGetServerSideProps } from '../../../../common/utils/create-getserversideprops';
import Concept from '../../../../modules/concept';
import { MediaQueryContextProvider } from '../../../../common/components/media-query/media-query-context';
import { LocalHandlerParams } from '../../../../common/utils/create-getserversideprops';
import {
  getConcept,
  getRunningOperationPromises as getConceptRunningOperationPromises
} from '../../../../common/components/concept/concept-slice';
import {
  getVocabulary,
  getRunningOperationPromises as getVocabularyRunningOperationPromises
} from '../../../../common/components/vocabulary/vocabulary-slice';

export default function ConceptPage(props: {
  _netI18Next: SSRConfig;
  isSSRMobile: boolean;
}) {
  const { t } = useTranslation('common');
  const { query } = useRouter();
  const terminologyId = (query?.terminologyId ?? '') as string;
  const conceptId = (query?.conceptId ?? '') as string;
  const [conceptTitle, setConceptTitle] = useState<string>('');

  return (
    <MediaQueryContextProvider value={{ isSSRMobile: props.isSSRMobile }}>
      {/* todo: use better feedbackSubject once more data is available */}
      <Layout feedbackSubject={`${t('concept-id')} ${conceptId}`}>
        <Head>
          <title>{conceptTitle ?? t('concept-page')} | {t('site-title')}</title>
        </Head>

        <Concept terminologyId={terminologyId} conceptId={conceptId} setConceptTitle={setConceptTitle} />
      </Layout>
    </MediaQueryContextProvider>
  );
}

export const getServerSideProps = createCommonGetServerSideProps<{ props: { data?: any } }>(
  async ({ req, store }: LocalHandlerParams) => {
    const ids = req.url?.split('/').filter(part => part.includes('-'));
    const terminologyId = ids?.[0] ?? '';
    const conceptId = ids?.[1].split('.')[0] ?? '';

    await store.dispatch(getVocabulary.initiate(terminologyId));
    await store.dispatch(getConcept.initiate({terminologyId, conceptId}));

    await Promise.all(getVocabularyRunningOperationPromises());
    await Promise.all(getConceptRunningOperationPromises());

    return { props: {}};
  }
);
