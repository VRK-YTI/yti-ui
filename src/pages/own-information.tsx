import React from 'react';
import Layout from '../layouts/layout';
import { SSRConfig, useTranslation } from 'next-i18next';
import { createCommonGetServerSideProps } from '../common/utils/create-getserversideprops';
import { MediaQueryContextProvider } from '../common/components/media-query/media-query-context';
import PageTitle from '../common/components/page-title';
import OwnInformation from '../modules/own-information';

export default function OwnInformationPage(props: {
  _netI18Next: SSRConfig;
  isSSRMobile: boolean;
}) {
  const { t } = useTranslation('common');

  return (
    <MediaQueryContextProvider value={{ isSSRMobile: props.isSSRMobile }}>
      <Layout>
        <PageTitle title={t('own-information')} />

        <OwnInformation />
      </Layout>
    </MediaQueryContextProvider>
  );
}

export const getServerSideProps = createCommonGetServerSideProps();
