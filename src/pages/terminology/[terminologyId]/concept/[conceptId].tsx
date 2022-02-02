import { SSRConfig, useTranslation } from 'next-i18next';
import { useRouter } from 'next/dist/client/router';
import React from 'react';
import Layout from '../../../../layouts/layout';
import Head from 'next/head';
import { createCommonGetServerSideProps } from '../../../../common/utils/create-getserversideprops';
import Concept from '../../../../modules/concept';
import { MediaQueryContextProvider } from '../../../../common/components/media-query/media-query-context';

/**
 * Error handling:
 * - should page be redirected to parent terminology
 *   page if conceptId is unknown?
 * - if both terminologyId and conceptId are unknown
 *   should user be redirected to 404 page?
 * -
 */

// TODO: perhaps move the component itself to components/
export default function ConceptPage(props: {
  _netI18Next: SSRConfig;
  isSSRMobile: boolean;
}) {
  const { t } = useTranslation('common');
  const { query } = useRouter();
  const terminologyId = (query?.terminologyId ?? '') as string;
  const conceptId = (query?.conceptId ?? '') as string;

  return (
    <MediaQueryContextProvider value={{ isSSRMobile: props.isSSRMobile }}>
      {/* todo: use better feedbackSubject once more data is available */}
      <Layout feedbackSubject={`${t('concept-id')} ${conceptId}`}>
        <Head>
          <title>{ t('concept-title') }</title>
        </Head>

        <Concept terminologyId={terminologyId} conceptId={conceptId} />
      </Layout>
    </MediaQueryContextProvider>
  );
}

export const getServerSideProps = createCommonGetServerSideProps();
