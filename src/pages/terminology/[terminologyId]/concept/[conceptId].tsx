import { SSRConfig, useTranslation } from 'next-i18next';
import { useRouter } from 'next/dist/client/router';
import React, { useState } from 'react';
import Layout from '../../../../layouts/layout';
import { createCommonGetServerSideProps } from '../../../../common/utils/create-getserversideprops';
import Concept from '../../../../modules/concept';
import { MediaQueryContextProvider } from '../../../../common/components/media-query/media-query-context';
import PageTitle from '../../../../common/components/page-title';

// TODO: perhaps move the component itself to components/
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

export const getServerSideProps = createCommonGetServerSideProps();
