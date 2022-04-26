import { MediaQueryContextProvider } from '@app/common/components/media-query/media-query-context';
import Layout from '@app/layouts/layout';
import { SSRConfig } from 'next-i18next';
import { default as NewConceptModule } from '@app/modules/new-concept';
import { useRouter } from 'next/router';
import { createCommonGetServerSideProps } from '@app/common/utils/create-getserversideprops';

export default function NewConcept(props: {
  _nextI18Next: SSRConfig;
  isSSRMobile: boolean;
}) {
  const { query } = useRouter();
  const conceptName = (query?.conceptName ?? '') as string;
  const terminologyId = (query?.terminologyId ?? '') as string;

  return (
    <MediaQueryContextProvider value={{ isSSRMobile: props.isSSRMobile }}>
      <Layout>
        <NewConceptModule
          terminologyId={terminologyId}
          conceptName={conceptName}
        />
      </Layout>
    </MediaQueryContextProvider>
  );
}

export const getServerSideProps = createCommonGetServerSideProps();
