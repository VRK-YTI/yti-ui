import { SSRConfig, useTranslation } from 'next-i18next';
import { useRouter } from 'next/dist/client/router';
import React, { useState } from 'react';
import Layout from '../../layouts/layout';
import { createCommonGetServerSideProps } from '../../common/utils/create-getserversideprops';
import Vocabulary from '../../modules/vocabulary';
import { MediaQueryContextProvider } from '../../common/components/media-query/media-query-context';
import PageTitle from '../../common/components/page-title';
import { LocalHandlerParams } from '../../common/utils/create-getserversideprops';
import { getCollections, getRunningOperationPromises, getVocabulary } from '../../common/components/vocabulary/vocabulary-slice';

export default function TerminologyPage(props: {
  _netI18Next: SSRConfig;
  isSSRMobile: boolean;
}) {
  const { t } = useTranslation('common');
  const { query } = useRouter();
  const terminologyId = (query?.terminologyId ?? '') as string;
  const [terminologyTitle, setTerminologyTitle] = useState<string | undefined>();

  return (
    <MediaQueryContextProvider value={{ isSSRMobile: props.isSSRMobile }}>
      {/* todo: use better feedbackSubject once more data is available */}
      <Layout feedbackSubject={`${t('terminology-id')} ${terminologyId}`}>
        <PageTitle title={terminologyTitle} />

        <Vocabulary
          id={terminologyId}
          setTerminologyTitle={setTerminologyTitle}
        />
      </Layout>
    </MediaQueryContextProvider>
  );
}

export const getServerSideProps = createCommonGetServerSideProps(
  async ({ req, store, params }: LocalHandlerParams) => {
    const id = Array.isArray(params.terminologyId) ?
      params.terminologyId[0] : params.terminologyId;

    if (id === undefined) {
      throw new Error('Invalid parameter for page');
    }

    await store.dispatch(getVocabulary.initiate(id));
    await store.dispatch(getCollections.initiate(id));

    await Promise.all(getRunningOperationPromises());

    return {};
  }
);
