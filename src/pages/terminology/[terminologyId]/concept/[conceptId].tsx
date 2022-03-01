import { SSRConfig, useTranslation } from 'next-i18next';
import { useRouter } from 'next/dist/client/router';
import React from 'react';
import Layout from '../../../../layouts/layout';
import Head from 'next/head';
import { createCommonGetServerSideProps } from '../../../../common/utils/create-getserversideprops';
import Concept from '../../../../modules/concept';
import { MediaQueryContextProvider } from '../../../../common/components/media-query/media-query-context';
import { Concept as ConceptType } from '../../../../common/interfaces/concept.interface';
import axios from 'axios';
import { LocalHandlerParams } from '../../../../common/utils/create-getserversideprops';
import { VocabularyInfoDTO } from '../../../../common/interfaces/vocabulary.interface';

// TODO: perhaps move the component itself to components/
export default function ConceptPage(props: {
  _netI18Next: SSRConfig;
  isSSRMobile: boolean;
  concept: ConceptType;
  terminology: VocabularyInfoDTO;
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
          <title>{t('concept-title')}</title>
        </Head>
        {props.concept && props.terminology &&
          <Concept terminologyId={terminologyId} conceptId={conceptId} terminologyData={props.terminology} conceptData={props.concept} />
        }
      </Layout>
    </MediaQueryContextProvider>
  );
}

export const getServerSideProps = createCommonGetServerSideProps<{ props: { data?: any } }>(
  async ({ req, res, locale }: LocalHandlerParams) => {
    const ids = req.url?.split('/').filter(part => part.includes('-'));
    const terminologyId = ids?.[0] ?? '';
    const conceptId = ids?.[1].split('.')[0] ?? '';
    let value = { props: {} };

    await axios.get(`http://localhost:3000/terminology-api/api/v1/frontend/concept?graphId=${terminologyId}&conceptId=${conceptId}`)
      .then(result => {
        value = {
          props: {
            'concept': result.data
          }
        };
      })
      .catch(e => {
        console.error(e);
      });

    await axios.get(`http://localhost:3000/terminology-api/api/v1/frontend/vocabulary?graphId=${terminologyId}`)
      .then(result => {
        value = {
          props: {
            ...value.props,
            'terminology': result.data
          }
        };
      })
      .catch(e => {
        console.error(e);
      });

    return value;
  }
);
