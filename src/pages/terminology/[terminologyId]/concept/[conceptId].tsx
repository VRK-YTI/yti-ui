import { SSRConfig, useTranslation } from 'next-i18next';
import { useRouter } from 'next/dist/client/router';
import React, { useState } from 'react';
import Layout from '../../../../layouts/layout';
import {
  createCommonGetServerSideProps,
  LocalHandlerParams,
} from '../../../../common/utils/create-getserversideprops';
import Concept from '../../../../modules/concept';
import { MediaQueryContextProvider } from '../../../../common/components/media-query/media-query-context';
import {
  getConcept,
  getRunningOperationPromises as getConceptRunningOperationPromises,
} from '../../../../common/components/concept/concept-slice';
import {
  getVocabulary,
  getRunningOperationPromises as getVocabularyRunningOperationPromises,
} from '../../../../common/components/vocabulary/vocabulary-slice';
import PageTitle from '../../../../common/components/page-title';

export default function ConceptPage(props: {
  _netI18Next: SSRConfig;
  isSSRMobile: boolean;
}) {
  const { t } = useTranslation('common');
  const { query } = useRouter();
  const terminologyId = (query?.terminologyId ?? '') as string;
  const conceptId = (query?.conceptId ?? '') as string;
  const [conceptTitle, setConceptTitle] = useState<string | undefined>();

  return (
    <MediaQueryContextProvider value={{ isSSRMobile: props.isSSRMobile }}>
      {/* todo: use better feedbackSubject once more data is available */}
      <Layout feedbackSubject={`${t('concept-id')} ${conceptId}`}>
        <PageTitle title={conceptTitle} />

        <Concept
          terminologyId={terminologyId}
          conceptId={conceptId}
          setConceptTitle={setConceptTitle}
        />
      </Layout>
    </MediaQueryContextProvider>
  );
}

export const getServerSideProps = createCommonGetServerSideProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: { data?: any };
}>(async ({ req, store, params }: LocalHandlerParams) => {
  const terminologyId = Array.isArray(params.terminologyId)
    ? params.terminologyId[0]
    : params.terminologyId;
  const conceptId = Array.isArray(params.conceptId)
    ? params.conceptId[0]
    : params.conceptId;

  if (terminologyId === undefined || conceptId === undefined) {
    throw new Error('Invalid parameters for page');
  }

  await store.dispatch(getVocabulary.initiate(terminologyId));
  await store.dispatch(getConcept.initiate({ terminologyId, conceptId }));

  await Promise.all(getVocabularyRunningOperationPromises());
  await Promise.all(getConceptRunningOperationPromises());

  return { props: {} };
});
