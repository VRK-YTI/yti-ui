import { SSRConfig, useTranslation } from 'next-i18next';
import { useRouter } from 'next/dist/client/router';
import React from 'react';
import Layout from '@app/layouts/layout';
import {
  createCommonGetServerSideProps,
  LocalHandlerParams,
} from '@app/common/utils/create-getserversideprops';
import Vocabulary from '@app/modules/vocabulary';
import {
  getConceptResult,
  getRunningOperationPromises,
  getVocabulary,
} from '@app/common/components/vocabulary/vocabulary.slice';
import { initialUrlState } from '@app/common/utils/hooks/use-url-state';
import {
  CommonContextState,
  CommonContextProvider,
} from '@app/common/components/common-context-provider';
import PageHead from '@app/common/components/page-head';
import { getPropertyValue } from '@app/common/components/property-value/get-property-value';
import { getStoreData } from '@app/common/components/page-head/utils';
import {
  getVocabularyCount,
  getRunningOperationPromises as countsGetRunningOperationPromises,
} from '@app/common/components/counts/counts.slice';
import {
  getAuthenticatedUser,
  getRunningOperationPromises as authenticatedUserGetRunningOperationPromises
} from '@app/common/components/login/login.slice';

interface TerminologyPageProps extends CommonContextState {
  _netI18Next: SSRConfig;
  title?: string;
  description?: string;
}

export default function TerminologyPage(props: TerminologyPageProps) {
  const { t } = useTranslation('common');
  const { query, asPath } = useRouter();
  const terminologyId = (query?.terminologyId ?? '') as string;

  return (
    <CommonContextProvider value={props}>
      <Layout feedbackSubject={`${t('feedback-vocabulary')} - ${props.title}`}>
        <PageHead
          title={props.title ?? ''}
          description={props.description ?? ''}
          path={asPath}
        />

        <Vocabulary id={terminologyId} />
      </Layout>
    </CommonContextProvider>
  );
}

export const getServerSideProps = createCommonGetServerSideProps(
  async ({ store, query, params, locale }: LocalHandlerParams) => {
    const id = Array.isArray(params.terminologyId)
      ? params.terminologyId[0]
      : params.terminologyId;

    if (id === undefined) {
      throw new Error('Invalid parameter for page');
    }

    const urlState = Object.assign({}, initialUrlState);

    if (query && query.q !== undefined) {
      urlState.q = Array.isArray(query.q) ? query.q[0] : query.q;
    }

    if (query && query.status !== undefined) {
      urlState.status = Array.isArray(query.status)
        ? query.status
        : [query.status];
    }

    if (query && query.type !== undefined) {
      urlState.type = Array.isArray(query.type) ? query.type[0] : query.type;
    }

    store.dispatch(getVocabulary.initiate({ id }));
    store.dispatch(
      getConceptResult.initiate({
        urlState: urlState,
        id,
        language: locale,
      })
    );
    store.dispatch(getVocabularyCount.initiate(id));
    store.dispatch(getAuthenticatedUser.initiate());

    await Promise.all(getRunningOperationPromises());
    await Promise.all(countsGetRunningOperationPromises());
    await Promise.all(authenticatedUserGetRunningOperationPromises());

    const vocabularyData = getStoreData({
      state: store.getState(),
      reduxKey: 'vocabularyAPI',
      functionKey: 'getVocabulary',
    });

    const title = getPropertyValue({
      property: vocabularyData?.properties?.prefLabel,
      language: locale,
    });

    const description = getPropertyValue({
      property: vocabularyData?.properties?.description,
      language: locale,
    });

    return {
      props: {
        title: title,
        description: description,
      },
    };
  }
);
