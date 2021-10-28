import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/dist/client/router';
import React from 'react';
import Link from 'next/link';
import { Heading, Link as DsLink } from 'suomifi-ui-components';
import Layout from '../../common/components/layout/layout';
import Head from 'next/head';
import { TerminologyInfoContainer } from '../../common/components/terminology/terminology-info.styles';
import { useSelector, useStore } from 'react-redux';
import { wrapper } from '../../store';
import { selectFilter, updateValue, useGetResultQuery } from '../../common/components/terminology-search/terminology-search-slice';

// TODO: perhaps move the component itself to components/
export default function Terminology( props: { id: any }) {
  const { t } = useTranslation('common');
  const { query } = useRouter();
  const id = query?.id ?? null;

  console.log('State on render', useStore().getState(), {props})
  console.log(props.id)

  const {data, error, isLoading} = useGetResultQuery(props.id);

  return (
    <Layout>
      <Head>
        <title>{ t('terminology-title') }</title>
      </Head>
      <Heading variant="h1">
        { t('terminology-title') }
      </Heading>
      <TerminologyInfoContainer>
        <label>
          { t('terminology-id') }
          <div id="terminologyState">{ id }</div>
        </label>
      </TerminologyInfoContainer>

      <div>
        <Link passHref href={ '/search/' }>
          <DsLink href="">
            Takaisin hakuun
          </DsLink>
        </Link>
      </div>
    </Layout>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(store => async ({params}) => {
  console.log("params:", params)
  const id = params;

  await store.dispatch(updateValue(id));

  return {
    props: {
      id,
    }
  }
})

// export async function getStaticProps({ locale, params }: { locale: string, params: any }) {
//   return {
//     props: {
//       ...(await serverSideTranslations(locale, ['common'])),
//       // Will be passed to the page component as props
//     },
//   };
// }

// // terminology/[id].tsx
// export async function getStaticPaths() {
//   return {
//     paths: [
//     ],
//     fallback: true,
//   };
//}
