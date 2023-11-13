import Layout from '@app/common/components/layout';
import { SSRConfig, useTranslation } from 'next-i18next';
import {
  createCommonGetServerSideProps,
  LocalHandlerParams,
} from '@app/common/utils/create-getserversideprops';
import {
  CommonContextState,
  CommonContextProvider,
} from 'yti-common-ui/common-context-provider';
import PageHead from 'yti-common-ui/page-head';
import { default as EditConceptModule } from '@app/modules/edit-concept';
import { useRouter } from 'next/router';
import {
  getVocabulary,
  getRunningQueriesThunk as getVocabularyRunningQueriesThunk,
} from '@app/common/components/vocabulary/vocabulary.slice';
import {
  getConcept,
  getRunningQueriesThunk as getConceptRunningQueriesThunk,
} from '@app/common/components/concept/concept.slice';
import { getStoreData } from '@app/common/utils/get-store-data';
import { Concept } from '@app/common/interfaces/concept.interface';
import { wrapper } from '@app/store';

interface NewConceptPageProps extends CommonContextState {
  _netI18Next: SSRConfig;
  conceptData: Concept;
}

export default function EditConcept(props: NewConceptPageProps) {
  wrapper.useHydration(props);
  const { t } = useTranslation('admin');
  const router = useRouter();
  const terminologyId = Array.isArray(router.query.terminologyId)
    ? router.query.terminologyId[0]
    : (router.query.terminologyId as string);

  return (
    <CommonContextProvider value={props}>
      <Layout user={props.user} fakeableUsers={props.fakeableUsers}>
        <PageHead
          baseUrl="https://sanastot.suomi.fi"
          title={t('new-concept-title')}
          siteTitle="Yhteentoimivuusalusta"
        />

        <EditConceptModule
          terminologyId={terminologyId}
          conceptData={props.conceptData}
        />
      </Layout>
    </CommonContextProvider>
  );
}

export const getServerSideProps = createCommonGetServerSideProps(
  async ({ store, params }: LocalHandlerParams) => {
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

    store.dispatch(getVocabulary.initiate({ id: terminologyId }));
    store.dispatch(getConcept.initiate({ terminologyId, conceptId }));

    await Promise.all(store.dispatch(getVocabularyRunningQueriesThunk()));
    await Promise.all(store.dispatch(getConceptRunningQueriesThunk()));

    const conceptData = getStoreData({
      state: store.getState(),
      reduxKey: 'conceptAPI',
      functionKey: 'getConcept',
    });

    return {
      props: {
        conceptData: conceptData ?? null,
        requireAuthenticated: true,
      },
    };
  }
);
