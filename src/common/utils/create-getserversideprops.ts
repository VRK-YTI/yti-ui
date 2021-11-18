import { GetServerSidePropsContext, NextApiResponse } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import User, { anonymousUser, UserProps } from '../interfaces/user-interface';
import withSession, { NextIronRequest } from './session';
import { AppStore, wrapper } from '../../store';
import { ParsedUrlQuery } from 'querystring';
import { Redirect } from 'next/dist/lib/load-custom-routes';
import { SSRConfig } from 'next-i18next';

export interface LocalHandlerParams {
  req: NextIronRequest;
  res: NextApiResponse;
  locale: string;
  store: AppStore;
}

export type localHandler<T> = (context: LocalHandlerParams) => Promise<T>;

export type CommonServerSideProps = UserProps & SSRConfig;

export type CreateCommonGetServerSidePropsResult<T> = (
  context: GetServerSidePropsContext<ParsedUrlQuery>
) => Promise<T & { props?: CommonServerSideProps, redirect?: Redirect, notFound?: true }>;

export function createCommonGetServerSideProps<T extends { [key: string]: any }>(
  handler?: localHandler<T>
): CreateCommonGetServerSidePropsResult<T> {
  return wrapper.getServerSideProps((store) => {
    return withSession<{ props: UserProps }>(
      async ({ req, res, locale }: { req: NextIronRequest, res: NextApiResponse, locale: string }) => {
        console.log('SSR state:');
        console.log(store.getState());
        const results = await handler?.({ req, res, locale, store });
        let sessionUser = req.session.get<User>('user') || anonymousUser;
        return {
          ...results,
          props: {
            ...results?.props,
            ...(await serverSideTranslations(locale, ['common'])),
            user: sessionUser
          },
        };
      });
  }) as CreateCommonGetServerSidePropsResult<T>;
}
