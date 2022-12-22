import React from 'react';
import Layout from '@app/common/components/layout';
import { SSRConfig, useTranslation } from 'next-i18next';
import { createCommonGetServerSideProps } from '@app/common/utils/create-getserversideprops';
import OwnInformation from '@app/modules/own-information';
import {
  CommonContextState,
  CommonContextProvider,
} from 'yti-common-ui/common-context-provider';
import PageHead from '@app/common/components/page-head';
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

interface OwnInformationPageProps extends CommonContextState {
  _netI18Next: SSRConfig;
}

export default function OwnInformationPage(props: OwnInformationPageProps) {
  const { t } = useTranslation('common');

  return (
    <CommonContextProvider value={props}>
      <Layout user={props.user} fakeableUsers={props.fakeableUsers}>
        <PageHead title={t('own-information')} />

        <OwnInformation />
      </Layout>
    </CommonContextProvider>
  );
}

export const getServerSideProps = createCommonGetServerSideProps(
  async ({ store, locale }) => {
    store.dispatch(getOrganizations.initiate(locale ?? 'fi'));
    store.dispatch(getSubscriptions.initiate(null));
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
