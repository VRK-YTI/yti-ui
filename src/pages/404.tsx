import Head from 'next/head';
import React from 'react';
import Error from '@app/common/components/error/error';
import ErrorLayout from '@app/layouts/error-layout';
import PageTitle from '@app/common/components/page-title';
import {
  CommonContextProvider,
  initialCommonContextState,
} from '@app/common/components/common-context-provider';

export default function Custom404() {
  return (
    <CommonContextProvider value={initialCommonContextState}>
      <ErrorLayout>
        <PageTitle title="Error" siteTitle="Yhteentoimivuusalusta" />
        <Head>
          <link rel="shortcut icon" href="/favicon.ico" />
        </Head>
        <Error />
      </ErrorLayout>
    </CommonContextProvider>
  );
}
