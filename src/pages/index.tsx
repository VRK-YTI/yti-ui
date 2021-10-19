import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import Layout from '../common/components/layout/layout';
import utilStyles from '../../styles/utils.module.scss';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { SSRConfig, useTranslation } from 'next-i18next';
import User, {
  anonymousUser,
  UserProps,
} from '../common/interfaces/user-interface';
import axios, { AxiosRequestConfig } from 'axios';
import withSession, { NextIronRequest } from '../common/utils/session';
import { GetServerSideProps, NextApiResponse } from 'next';
import useUser from '../common/hooks/useUser';

export default function Home(props: {
  _netI18Next: SSRConfig;
  sessionUser: User;
  user: User;
}) {
  const { t } = useTranslation('common');

  const { user, } = useUser({ initialData: props.user });

  return (
    <Layout user={user}>
      <Head>
        <title>{ t('terminology-site-title') }</title>
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <section className={utilStyles.headingMd}>
        <Link href="/search">
          <a>{ t('terminology-search') }</a>
        </Link>
      </section>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = withSession<{ props: UserProps | {} }>(
  async ({ req, res, locale }: { req: NextIronRequest, res: NextApiResponse, locale: string }) => {
    let sessionUser = req.session.get<User>('user') || anonymousUser;
    const cookies = req.session.get<{ [key: string]: string }>('cookies') || {};

    const axiosConfig: AxiosRequestConfig = {
      withCredentials: true
    };

    // TODO: cookies should be handled by a cookie jar
    if (cookies['JSESSIONID']) {
      axiosConfig.headers = {
        Cookie: 'JSESSIONID=' + cookies['JSESSIONID']
      };
    }

    // let's try fetching from api to see if we are properly authenticated
    const fetchUrl: string = process.env.TERMINOLOGY_API_URL + '/api/v1/frontend/authenticated-user';
    const response = await axios.get(fetchUrl, axiosConfig);
    const user = response.data;

    const props: any = {
      ...(await serverSideTranslations(locale, ['common'])),
      sessionUser: sessionUser,
      user: user
    };

    return { props: props };
  },
);
