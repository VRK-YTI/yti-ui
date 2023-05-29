import React from 'react';
import Layout from '@app/common/components/layout';
import { SSRConfig, useTranslation } from 'next-i18next';
import { createCommonGetServerSideProps } from '@app/common/utils/create-getserversideprops';
import {
  CommonContextProvider,
  CommonContextState,
} from 'yti-common-ui/common-context-provider';
import {
  getGroups,
  getOrganizations,
  getRunningQueriesThunk as terminologyGetRunningQueriesThunk,
  getSearchResult,
} from '@app/common/components/terminology-search/terminology-search.slice';
import {
  getCounts,
  getRunningQueriesThunk as countsGetRunningQueriesThunk,
} from '@app/common/components/counts/counts.slice';
import PageHead from 'yti-common-ui/page-head';
import { initialUrlState } from '@app/common/utils/hooks/use-url-state';
import { Button } from 'suomifi-ui-components';

import EditCollection from '@app/modules/edit-collection';
import { ButtonBlock } from '@app/pages/schema/schema.styles';
import Separator from 'yti-common-ui/separator';
import { useRouter } from 'next/router';

interface IndexPageProps extends CommonContextState {
  _netI18Next: SSRConfig;
}

export default function IndexPage(props: IndexPageProps) {
  const { t } = useTranslation('common');

  const router = useRouter();

  const registerSchema = () => {
    // register a new schema
    router.push('/schema');
  };

  const registerCrossWalk = () => {
    //Register a new crosswalk
    router.push('/crosswalk');
  };

  // May edit collection can be used to have the crosswalk list?
  return (
    <CommonContextProvider value={props}>
      <Layout user={props.user} fakeableUsers={props.fakeableUsers}>
        <PageHead
          baseUrl="https://sanastot.suomi.fi"
          title={t('terminology-site-title')}
          description={t('terminology-search-info')}
        />
        <Separator isLarge />
        <ButtonBlock>
          <Button onClick={() => registerSchema()} id="submit-button">
            {t('Register schema', { ns: 'admin' })}
          </Button>
          <Button onClick={() => registerCrossWalk()} id="submit-button">
            {t('Register crosswalks', { ns: 'admin' })}
          </Button>
        </ButtonBlock>

        <EditCollection terminologyId={'1'} collectionName={'Crosswalk 1'} />
      </Layout>
    </CommonContextProvider>
  );
}

export const getServerSideProps = createCommonGetServerSideProps(
  async ({ store, locale, query }) => {
    const urlState = Object.assign({}, initialUrlState);

    if (query) {
      if (query.q !== undefined) {
        urlState.q = Array.isArray(query.q) ? query.q[0] : query.q;
      }

      if (query.page !== undefined) {
        const pageValue = Array.isArray(query.page)
          ? parseInt(query.page[0], 10)
          : parseInt(query.page, 10);
        urlState.page = !isNaN(pageValue) ? pageValue : initialUrlState.page;
      }

      if (query.status !== undefined) {
        urlState.status = Array.isArray(query.status)
          ? query.status
          : [query.status];
      }

      if (query.type !== undefined) {
        urlState.type = Array.isArray(query.type) ? query.type[0] : query.type;
      }

      if (query.domain) {
        urlState.domain = Array.isArray(query.domain)
          ? query.domain
          : [query.domain];
      }

      if (query.organization) {
        urlState.organization = Array.isArray(query.organization)
          ? query.organization[0]
          : query.organization;
      }

      if (query.lang) {
        urlState.lang = Array.isArray(query.lang) ? query.lang[0] : query.lang;
      }
    }

    store.dispatch(
      getSearchResult.initiate({ urlState: urlState, language: locale ?? 'fi' })
    );
    store.dispatch(getGroups.initiate(locale ?? 'fi'));
    store.dispatch(getOrganizations.initiate(locale ?? 'fi'));
    store.dispatch(getCounts.initiate(null));

    await Promise.all(store.dispatch(terminologyGetRunningQueriesThunk()));
    await Promise.all(store.dispatch(countsGetRunningQueriesThunk()));

    return {};
  }
);
