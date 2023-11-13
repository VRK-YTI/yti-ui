import React from 'react';
import Layout from '@app/common/components/layout';
import { SSRConfig, useTranslation } from 'next-i18next';
import { createCommonGetServerSideProps } from '@app/common/utils/create-getserversideprops';
import OwnInformation from '@app/modules/own-information';
import {
  CommonContextState,
  CommonContextProvider,
} from 'yti-common-ui/common-context-provider';
import PageHead from 'yti-common-ui/page-head';
import {
  getSubscriptions,
  getRunningQueriesThunk as getSubscriptionRunningQueriesThunk,
} from '@app/common/components/subscription/subscription.slice';
import {
  getRequests,
  getRunningQueriesThunk as getAccessReqRunningQueriesThunk,
} from '@app/common/components/access-request/access-request.slice';
import {
  getOrganizations,
  getRunningQueriesThunk as getOrganizationsRunningQueriesThunk,
} from '@app/common/components/terminology-search/terminology-search.slice';
import { wrapper } from '@app/store';

interface OwnInformationPageProps extends CommonContextState {
  _netI18Next: SSRConfig;
}

export default function OwnInformationPage(props: OwnInformationPageProps) {
  wrapper.useHydration(props);
  const { t } = useTranslation('common');

  return (
    <CommonContextProvider value={props}>
      <Layout user={props.user} fakeableUsers={props.fakeableUsers}>
        <PageHead
          baseUrl="https://sanastot.suomi.fi"
          title={t('own-information')}
        />

        <OwnInformation />
      </Layout>
    </CommonContextProvider>
  );
}

export const getServerSideProps = createCommonGetServerSideProps(
  async ({ store, locale }) => {
    store.dispatch(getOrganizations.initiate(locale ?? 'fi'));
    store.dispatch(getSubscriptions.initiate());
    store.dispatch(getRequests.initiate());

    await Promise.all(store.dispatch(getOrganizationsRunningQueriesThunk()));
    await Promise.all(store.dispatch(getSubscriptionRunningQueriesThunk()));
    await Promise.all(store.dispatch(getAccessReqRunningQueriesThunk()));

    return {
      props: {
        requireAuthenticated: true,
      },
    };
  }
);
