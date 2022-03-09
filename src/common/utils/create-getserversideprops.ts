import { GetServerSidePropsContext, NextApiResponse } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import User, { anonymousUser, UserProps } from '../interfaces/user-interface';
import withSession, { NextIronRequest } from './session';
import { AppStore, wrapper } from '../../store';
import { ParsedUrlQuery } from 'querystring';
import { Redirect } from 'next/dist/lib/load-custom-routes';
import { SSRConfig } from 'next-i18next';
import { setLogin } from '../components/login/login-slice';
import { setAlert } from '../components/alert/alert.slice';

export interface LocalHandlerParams {
  req: NextIronRequest;
  res: NextApiResponse;
  locale: string;
  store: AppStore;
}

export type localHandler<T> = (context: LocalHandlerParams) => Promise<T>;

export type CommonServerSideProps = UserProps & SSRConfig & {
  isSSRMobile: boolean;
};

export type CreateCommonGetServerSidePropsResult<T> = (
  context: GetServerSidePropsContext<ParsedUrlQuery>
) => Promise<T & { props?: CommonServerSideProps, redirect?: Redirect, notFound?: true }>;

let userLogged = false;

export function createCommonGetServerSideProps<T extends { [key: string]: any }>(
  handler?: localHandler<T>
): CreateCommonGetServerSidePropsResult<T> {
  return wrapper.getServerSideProps((store) => {
    return withSession<{ props: UserProps }>(
      async ({ req, res, locale }: { req: NextIronRequest, res: NextApiResponse, locale: string }) => {
        const results = await handler?.({ req, res, locale, store });
        store.dispatch(setLogin(req.session.get<User>('user') || anonymousUser));
        const userAgent = req.headers['user-agent'] ?? '';

        if (!userLogged && req.session.get<User>('user')) {
          userLogged = true;
        }

        if (!req.session.get<User>('user')) {
          if (userLogged) {
            store.dispatch(setAlert([{
              status: 200,
              data: 'Olet kirjautunut ulos palvelusta.'
            }]));
          }

          if (store.getState().alert.alerts.length > 0) {
            userLogged = false;
          }
        }

        return {
          ...results,
          props: {
            ...results?.props,
            ...(await serverSideTranslations(locale, ['alert', 'collection', 'common', 'concept'])),
            isSSRMobile: Boolean(userAgent.match(
              /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
            )),
          },
        };
      });
  }) as CreateCommonGetServerSidePropsResult<T>;
}
