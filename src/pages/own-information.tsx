import React from 'react';
import Layout from '@app/layouts/layout';
import { SSRConfig, useTranslation } from 'next-i18next';
import {
  createCommonGetServerSideProps,
  LocalHandlerParams,
} from '@app/common/utils/create-getserversideprops';
import OwnInformation from '@app/modules/own-information';
import {
  CommonContextState,
  CommonContextProvider,
} from '@app/common/components/common-context-provider';
import PageHead from '@app/common/components/page-head';
import {
  getAuthenticatedUser,
  getRunningOperationPromises,
} from '@app/common/components/login/login.slice';
import { getStoreData } from '@app/common/components/page-head/utils';

interface OwnInformationPageProps extends CommonContextState {
  _netI18Next: SSRConfig;
}

export default function OwnInformationPage(props: OwnInformationPageProps) {
  const { t } = useTranslation('common');

  return (
    <CommonContextProvider value={props}>
      <Layout>
        <PageHead title={t('own-information')} />

        <OwnInformation />
      </Layout>
    </CommonContextProvider>
  );
}

export const getServerSideProps = createCommonGetServerSideProps(
  async ({ store }: LocalHandlerParams) => {
    store.dispatch(getAuthenticatedUser.initiate());

    await Promise.all(getRunningOperationPromises());

    const user = getStoreData({
      state: store.getState(),
      reduxKey: 'loginApi',
      functionKey: 'getAuthenticatedUser',
    });

    if (user.anonymous) {
      return {
        redirect: {
          destination: '/401',
          permanent: false,
        },
      };
    }

    return {
      props: {},
    };
  }
);
