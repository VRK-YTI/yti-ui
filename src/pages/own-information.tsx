import React from 'react';
import Layout from '@app/layouts/layout';
import { SSRConfig, useTranslation } from 'next-i18next';
import { createCommonGetServerSideProps } from '@app/common/utils/create-getserversideprops';
import PageTitle from '@app/common/components/page-title';
import OwnInformation from '@app/modules/own-information';
import {
  CommonContextInterface,
  CommonContextProvider,
} from '@app/common/components/common-context-provider';

interface OwnInformationPageProps extends CommonContextInterface {
  _netI18Next: SSRConfig;
}

export default function OwnInformationPage(props: OwnInformationPageProps) {
  const { t } = useTranslation('common');

  return (
    <CommonContextProvider value={props}>
      <Layout>
        <PageTitle title={t('own-information')} />

        <OwnInformation />
      </Layout>
    </CommonContextProvider>
  );
}

export const getServerSideProps = createCommonGetServerSideProps();
