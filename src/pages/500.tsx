import Head from 'next/head';
import { MediaQueryContextProvider } from '../common/components/media-query/media-query-context';
import ErrorLayout from '../layouts/error-layout';

export default function Custom500() {
  return (
    <MediaQueryContextProvider value={{ isSSRMobile: false }}>
      <ErrorLayout>
        <Head>
          <title>Sanastot</title>
          <link rel="shortcut icon" href="/favicon.ico" />
        </Head>
      </ErrorLayout>
    </MediaQueryContextProvider>
  );
}
