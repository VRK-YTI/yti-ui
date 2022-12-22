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
  getRunningQueriesThunk,
} from '@app/common/components/subscription/subscription.slice';

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
  async ({ store }) => {
    store.dispatch(getSubscriptions.initiate(null));

    Promise.all(store.dispatch(getRunningQueriesThunk()));

    return {
      props: {
        requireAuthenticated: true,
      },
    };
  }
);
