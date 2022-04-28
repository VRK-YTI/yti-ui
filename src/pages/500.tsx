import Head from 'next/head';
import Error from '@app/common/components/error/error';
import PageTitle from '@app/common/components/page-title';
import ErrorLayout from '@app/layouts/error-layout';
import {
  CommonContextProvider,
  defaultCommonContextValue,
} from '@app/common/components/common-context-provider';

export default function Custom500() {
  return (
    <CommonContextProvider value={defaultCommonContextValue}>
      <ErrorLayout>
        <PageTitle title="Error" siteTitle="Yhteentoimivuusalusta" />
        <Head>
          <link rel="shortcut icon" href="/favicon.ico" />
        </Head>
        <Error errorCode={500} />
      </ErrorLayout>
    </CommonContextProvider>
  );
}
