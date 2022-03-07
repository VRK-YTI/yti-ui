import { SSRConfig, useTranslation } from "next-i18next";
import { useRouter } from "next/dist/client/router";
import React, { useState } from "react";
import Layout from "../../../../layouts/layout";
import { createCommonGetServerSideProps } from "../../../../common/utils/create-getserversideprops";
import { MediaQueryContextProvider } from "../../../../common/components/media-query/media-query-context";
import Collection from "../../../../modules/collection";
import PageTitle from "../../../../common/components/page-title";

// TODO: perhaps move the component itself to components/
export default function CollectionPage(props: {
  _netI18Next: SSRConfig;
  isSSRMobile: boolean;
}) {
  const { t } = useTranslation("common");
  const { query } = useRouter();
  const terminologyId = (query?.terminologyId ?? "") as string;
  const collectionId = (query?.collectionId ?? "") as string;
  const [collectionTitle, setCollectionTitle] = useState<string | undefined>();

  return (
    <MediaQueryContextProvider value={{ isSSRMobile: props.isSSRMobile }}>
      {/* todo: use better feedbackSubject once more data is available */}
      <Layout feedbackSubject={`${t("collection-id")} ${collectionId}`}>
        <PageTitle title={collectionTitle} />

        <Collection
          terminologyId={terminologyId}
          collectionId={collectionId}
          setCollectionTitle={setCollectionTitle}
        />
      </Layout>
    </MediaQueryContextProvider>
  );
}

export const getServerSideProps = createCommonGetServerSideProps();
