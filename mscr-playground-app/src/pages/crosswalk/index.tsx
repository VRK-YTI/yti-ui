import InfoExpander from '@app/common/components/info-dropdown/info-expander';
import React from 'react';
import {
  CommonContextProvider,
  initialCommonContextState,
} from 'yti-common-ui/common-context-provider';
import Layout from 'yti-common-ui/layout/layout';
import PageHead from 'yti-common-ui/page-head';

export default function Custom404() {
  return (
    <CommonContextProvider value={initialCommonContextState}>
      <Layout></Layout>
    </CommonContextProvider>
  );
}
