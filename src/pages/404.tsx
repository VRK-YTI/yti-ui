import Head from "next/head";
import React from "react";
import { MediaQueryContextProvider } from "../common/components/media-query/media-query-context";
import Error from "../common/components/error/error";
import ErrorLayout from "../layouts/error-layout";
import PageTitle from "../common/components/page-title";

export default function Custom404() {
  return (
    <MediaQueryContextProvider value={{ isSSRMobile: false }}>
      <ErrorLayout>
        <PageTitle title="Error" siteTitle="Yhteentoimivuusalusta" />
        <Head>
          <link rel="shortcut icon" href="/favicon.ico" />
        </Head>
        <Error />
      </ErrorLayout>
    </MediaQueryContextProvider>
  );
}
