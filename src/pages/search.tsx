import React from "react";
import { SSRConfig } from "next-i18next";
import Layout from "../layouts/layout";
import TerminologySearch from "../modules/terminology-search";
import { createCommonGetServerSideProps } from "../common/utils/create-getserversideprops";
import { MediaQueryContextProvider } from "../common/components/media-query/media-query-context";
import PageTitle from "../common/components/page-title";

/*
 * @deprecated Search-page has been replaced by Index-page.
 */

export default function SearchPage(props: {
  _netI18Next: SSRConfig;
  isSSRMobile: boolean;
}) {
  console.warn("Search-page has been replaced by Index-page.");

  return (
    <MediaQueryContextProvider value={{ isSSRMobile: props.isSSRMobile }}>
      <Layout>
        <PageTitle />
        <TerminologySearch />
      </Layout>
    </MediaQueryContextProvider>
  );
}

export const getServerSideProps = createCommonGetServerSideProps();
