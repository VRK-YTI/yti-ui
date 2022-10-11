import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
  anonymousUser,
  UserProps,
} from '@app/common/interfaces/user.interface';
import withSession from './session';
import { AppStore, wrapper } from '@app/store';
import { ParsedUrlQuery } from 'querystring';
import { Redirect } from 'next/dist/lib/load-custom-routes';
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
) => Promise<
  T & { props?: CommonServerSideProps; redirect?: Redirect; notFound?: true }
>;

export function createCommonGetServerSideProps<
  T extends { [key: string]: unknown }
>(handler?: localHandler<T>): CreateCommonGetServerSidePropsResult<T> {
  return wrapper.getServerSideProps((store) => {
    return withSession<{ props: UserProps }>(
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

        store.dispatch(setLogin(req.session.user || anonymousUser));

        store.dispatch(
          setAdminControls(process.env.ADMIN_CONTROLS_DISABLED === 'true')
        );

        const userAgent = req.headers['user-agent'] ?? '';

        return {
          ...results,
          props: {
            ...results?.props,
            ...(await serverSideTranslations(locale, [
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
