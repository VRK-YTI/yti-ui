import React from 'react';
import Error from '@app/common/components/error/error';
import ErrorLayout from 'yti-common-ui/layout/error-layout';
import {
  CommonContextProvider,
  initialCommonContextState,
} from 'yti-common-ui/common-context-provider';
import PageHead from '@app/common/components/page-head';

export default function Custom404() {
  return (
    <CommonContextProvider value={initialCommonContextState}>
      <ErrorLayout>
        <PageHead
          title="Error"
          siteTitle="Yhteentoimivuusalusta"
          description="An error occured"
        />

        <Error />
      </ErrorLayout>
    </CommonContextProvider>
  );
}
