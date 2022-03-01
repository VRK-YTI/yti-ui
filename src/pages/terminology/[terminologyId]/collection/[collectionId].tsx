import { SSRConfig, useTranslation } from 'next-i18next';
import { useRouter } from 'next/dist/client/router';
import React from 'react';
import Layout from '../../../../layouts/layout';
import Head from 'next/head';
import { createCommonGetServerSideProps } from '../../../../common/utils/create-getserversideprops';
import { MediaQueryContextProvider } from '../../../../common/components/media-query/media-query-context';
import Collection from '../../../../modules/collection';
import { LocalHandlerParams } from '../../../../common/utils/create-getserversideprops';
import axios from 'axios';
import { VocabularyInfoDTO } from '../../../../common/interfaces/vocabulary.interface';
import { Collection as CollectionType } from '../../../../common/interfaces/collection.interface';

// TODO: perhaps move the component itself to components/
export default function CollectionPage(props: {
  _netI18Next: SSRConfig;
  isSSRMobile: boolean;
  collection: CollectionType;
  terminology: VocabularyInfoDTO;
}) {
  const { t } = useTranslation('common');
  const { query } = useRouter();
  const terminologyId = (query?.terminologyId ?? '') as string;
  const collectionId = (query?.collectionId ?? '') as string;

  return (
    <MediaQueryContextProvider value={{ isSSRMobile: props.isSSRMobile }}>
      {/* todo: use better feedbackSubject once more data is available */}
      <Layout feedbackSubject={`${t('collection-id')} ${collectionId}`}>
        <Head>
          <title>{t('collection-title')}</title>
        </Head>

        <Collection terminologyId={terminologyId} collectionId={collectionId} terminologyData={props.terminology} collectionData={props.collection} />
      </Layout>
    </MediaQueryContextProvider>
  );
}
export const getServerSideProps = createCommonGetServerSideProps<{ props: { data?: any } }>(
  async ({ req, res, locale }: LocalHandlerParams) => {
    const ids = req.url?.split('/').filter(part => part.includes('-'));
    const terminologyId = ids?.[0] ?? '';
    const collectionId = ids?.[1].split('.')[0] ?? '';
    let value = { props: {} };

    await axios.get(`http://localhost:3000/terminology-api/api/v1/frontend/collection?graphId=${terminologyId}&collectionId=${collectionId}`)
      .then(result => {
        value = {
          props: {
            'collection': result.data
          }
        };
      })
      .catch(e => {
        console.error('error');
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
        console.error('error');
      });

    return value;
  }
);
