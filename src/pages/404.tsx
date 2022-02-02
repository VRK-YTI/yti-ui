import Head from 'next/head';
import React from 'react';
import { MediaQueryContextProvider } from '../common/components/media-query/media-query-context';
import Error from '../common/components/error/error';
import ErrorLayout from '../layouts/error-layout';

/**
 * Error handling:
 * - should "Sanastot" be displayed
 *   in all languages since <Error/>
 *   displayes info in all languages?
 */

export default function Custom404() {
  return (
    <MediaQueryContextProvider value={{ isSSRMobile: false }}>
      <ErrorLayout>
        <Head>
          <title>Sanastot</title>
          <link rel="shortcut icon" href="/favicon.ico" />
        </Head>
        <Error />
      </ErrorLayout>
    </MediaQueryContextProvider>
  );
}
