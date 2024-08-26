import { SSRConfig, useTranslation } from 'next-i18next';
import { useRouter } from 'next/dist/client/router';
import React from 'react';
import Layout from '@app/common/components/layout';
import {
  createCommonGetServerSideProps,
  LocalHandlerParams,
} from '@app/common/utils/create-getserversideprops';
import Concept from '@app/modules/concept';
import {
  getConcept,
  getRunningQueriesThunk as getConceptRunningQueriesThunk,
} from '@app/common/components/concept/concept.slice';
import {
  getTerminology,
  getRunningQueriesThunk as getVocabularyRunningQueriesThunk,
} from '@app/common/components/vocabulary/vocabulary.slice';
import {
  CommonContextState,
  CommonContextProvider,
} from 'yti-common-ui/common-context-provider';
import PageHead from 'yti-common-ui/page-head';
import { getPropertyValue } from '@app/common/components/property-value/get-property-value';
import { getStoreData } from '@app/common/utils/get-store-data';
import { wrapper } from '@app/store';
import { getLanguageVersion } from 'yti-common-ui/utils/get-language-version';

interface ConceptPageProps extends CommonContextState {
  _netI18Next: SSRConfig;
  conceptDescription: string;
  conceptTitle: string;
  vocabularyTitle: string;
}

export default function ConceptPage(props: ConceptPageProps) {
  wrapper.useHydration(props);
  const { t } = useTranslation('common');
  const { query, asPath } = useRouter();
  const terminologyId = (query?.terminologyId ?? '') as string;
  const conceptId = (query?.conceptId ?? '') as string;

  return (
    <CommonContextProvider value={props}>
      <Layout
        user={props.user}
        fakeableUsers={props.fakeableUsers}
        feedbackSubject={`${t('feedback-concept')} - ${props.conceptTitle}`}
      >
        <PageHead
          baseUrl="https://sanastot.suomi.fi"
          title={[props.conceptTitle, props.vocabularyTitle]}
          description={props.conceptDescription}
          path={asPath}
        />

        <Concept terminologyId={terminologyId} conceptId={conceptId} />
      </Layout>
    </CommonContextProvider>
  );
}

export const getServerSideProps = createCommonGetServerSideProps(
  async ({ store, params, locale }: LocalHandlerParams) => {
    if (!params) {
      throw new Error('Missing parameters for page');
    }

    const terminologyId = Array.isArray(params.terminologyId)
      ? params.terminologyId[0]
      : params.terminologyId;
    const conceptId = Array.isArray(params.conceptId)
      ? params.conceptId[0]
      : params.conceptId;

    if (terminologyId === undefined || conceptId === undefined) {
      throw new Error('Invalid parameters for page');
    }

    store.dispatch(getTerminology.initiate({ id: terminologyId }));
    store.dispatch(getConcept.initiate({ terminologyId, conceptId }));

    await Promise.all(store.dispatch(getVocabularyRunningQueriesThunk()));
    await Promise.all(store.dispatch(getConceptRunningQueriesThunk()));

    const vocabularyData = getStoreData({
      state: store.getState(),
      reduxKey: 'terminologyAPI',
      functionKey: 'getTerminology',
    });

    const conceptData = getStoreData({
      state: store.getState(),
      reduxKey: 'conceptAPI',
      functionKey: 'getConcept',
    });

    if (!conceptData) {
      return {
        redirect: {
          destination: '/404',
          permanent: false,
        },
      };
    }

    const vocabularyTitle = getPropertyValue({
      property: vocabularyData?.properties?.prefLabel,
      language: locale,
    });

    const conceptTitle = getLanguageVersion({
      data: conceptData.label,
      lang: locale ?? 'fi',
    });

    const conceptDescription = getLanguageVersion({
      data: conceptData.definition,
      lang: locale ?? 'fi',
    });
    return {
      props: {
        conceptDescription: conceptDescription,
        conceptTitle: conceptTitle,
        vocabularyTitle: vocabularyTitle,
      },
    };
  }
);
