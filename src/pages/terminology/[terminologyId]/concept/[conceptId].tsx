import { SSRConfig, useTranslation } from 'next-i18next';
import { useRouter } from 'next/dist/client/router';
import React, { useState } from 'react';
import Layout from '@app/layouts/layout';
import {
  createCommonGetServerSideProps,
  LocalHandlerParams,
} from '@app/common/utils/create-getserversideprops';
import Concept from '@app/modules/concept';
import {
  getConcept,
  getRunningOperationPromises as getConceptRunningOperationPromises,
} from '@app/common/components/concept/concept.slice';
import {
  getVocabulary,
  getRunningOperationPromises as getVocabularyRunningOperationPromises,
} from '@app/common/components/vocabulary/vocabulary.slice';
import {
  CommonContextState,
  CommonContextProvider,
} from '@app/common/components/common-context-provider';
import PageHead from '@app/common/components/page-head';

interface ConceptPageProps extends CommonContextState {
  _netI18Next: SSRConfig;
}

export default function ConceptPage(props: ConceptPageProps) {
  const { t } = useTranslation('common');
  const { query, asPath } = useRouter();
  const terminologyId = (query?.terminologyId ?? '') as string;
  const conceptId = (query?.conceptId ?? '') as string;
  const [conceptTitle, setConceptTitle] = useState<string | undefined>();
  const [vocabularyTitle, setVocabularyTitle] = useState<string | undefined>();
  const [conceptDescription, setConceptDescription] = useState<
    string | undefined
  >();

  return (
    <CommonContextProvider value={props}>
      {/* todo: use better feedbackSubject once more data is available */}
      <Layout feedbackSubject={`${t('concept-id')} ${conceptId}`}>
        <PageHead
          title={[conceptTitle, vocabularyTitle]}
          description={conceptDescription}
          path={asPath}
        />

        <Concept
          terminologyId={terminologyId}
          conceptId={conceptId}
          setConceptTitle={setConceptTitle}
          setVocabularyTitle={setVocabularyTitle}
          setConceptDescription={setConceptDescription}
        />
      </Layout>
    </CommonContextProvider>
  );
}

export const getServerSideProps = createCommonGetServerSideProps(
  async ({ store, params }: LocalHandlerParams) => {
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

    return {};
  }
);
