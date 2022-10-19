import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
  anonymousUser,
  UserProps,
} from '@app/common/interfaces/user.interface';
import withSession from './session';
import { AppStore, wrapper } from '@app/store';
import { ParsedUrlQuery } from 'querystring';
import { SSRConfig } from 'next-i18next';
import { setLogin } from '@app/common/components/login/login.slice';
import { CommonContextState } from '../components/common-context-provider';
import { setAdminControls } from '../components/admin-controls/admin-controls.slice';

export interface LocalHandlerParams extends GetServerSidePropsContext {
  store: AppStore;
}

export type localHandler<T> = (context: LocalHandlerParams) => Promise<T>;

export type CommonServerSideProps = UserProps &
  SSRConfig &
  CommonContextState & {
    isSSRMobile: boolean;
  };

export type CreateCommonGetServerSidePropsResult<T> = (
  context: GetServerSidePropsContext<ParsedUrlQuery>
) =>
  | GetServerSidePropsResult<T & { props?: CommonServerSideProps }>
  | Promise<GetServerSidePropsResult<T>>;

export function createCommonGetServerSideProps<
  T extends { [key: string]: unknown } = { [key: string]: unknown }
>(handler?: localHandler<T>): CreateCommonGetServerSidePropsResult<T> {
  return wrapper.getServerSideProps((store) => {
    return withSession(
      async ({ req, res, resolvedUrl, params, query, locale }) => {
        const results = await handler?.({
          req,
          res,
          resolvedUrl,
          params,
          query,
          locale,
          store,
        });

        if (
          results?.props &&
          typeof (results.props as Record<string, boolean>)[
            'isAuthenticated'
          ] === 'boolean' &&
          !(results.props as Record<string, boolean>).isAuthenticated
        ) {
          store.dispatch(setLogin(anonymousUser));
        } else {
          store.dispatch(
            setLogin(req.session.user ? req.session.user : anonymousUser)
          );
        }

        store.dispatch(
          setAdminControls(process.env.ADMIN_CONTROLS_DISABLED === 'true')
        );

        const userAgent = req.headers['user-agent'] ?? '';

        const resultsProps = results
          ? typeof results.props === 'object'
            ? results.props
            : {}
          : {};

        return {
          ...results,
          props: {
            ...resultsProps,
            ...(await serverSideTranslations(locale ?? 'fi', [
              'admin',
              'alert',
              'collection',
              'common',
              'concept',
              'own-information',
            ])),
            isSSRMobile: Boolean(
              userAgent.match(
                /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
              )
            ),
            isMatomoEnabled: process.env.MATOMO_ENABLED === 'true',
            matomoUrl: process.env.MATOMO_URL ?? null,
            matomoSiteId: process.env.MATOMO_SITE_ID ?? null,
          },
        };
      }
    );
  }) as CreateCommonGetServerSidePropsResult<T>;
}
