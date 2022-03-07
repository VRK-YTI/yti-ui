import Head from "next/head";
import Error from "../common/components/error/error";
import { MediaQueryContextProvider } from "../common/components/media-query/media-query-context";
import PageTitle from "../common/components/page-title";
import ErrorLayout from "../layouts/error-layout";

export default function Custom500() {
  return (
    <MediaQueryContextProvider value={{ isSSRMobile: false }}>
      <ErrorLayout>
        <PageTitle title="Error" siteTitle="Yhteentoimivuusalusta" />
        <Head>
          <link rel="shortcut icon" href="/favicon.ico" />
        </Head>
        <Error errorCode={500} />
      </ErrorLayout>
    </MediaQueryContextProvider>
  );
}
