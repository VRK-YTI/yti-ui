import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
  anonymousUser,
  User,
  UserProps,
} from '@app/common/interfaces/user.interface';
import withSession from './session';
import { AppStore, wrapper } from '@app/store';
import { ParsedUrlQuery } from 'querystring';
import { SSRConfig } from 'next-i18next';
import {
  getAuthenticatedUser,
  setLogin,
} from '@app/common/components/login/login.slice';
import { CommonContextState } from '../components/common-context-provider';
import { setAdminControls } from '../components/admin-controls/admin-controls.slice';
import { getStoreData } from '../components/page-head/utils';

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

        console.log('SSR got these headers:');
        console.log(req.headers);

        console.log('requesting authenticated-user');
        await store.dispatch(getAuthenticatedUser.initiate());
        const user: User = getStoreData({
          state: store.getState(),
          reduxKey: 'loginApi',
          functionKey: 'getAuthenticatedUser',
        });
        console.log('found this user data:');
        console.log(user);

        if (!user || user.anonymous) {
          console.log('login is anonymous');
          store.dispatch(setLogin(anonymousUser));
        } else {
          console.log('login is real user');
          console.log(user);
          console.log(req.session.user);
          store.dispatch(
            setLogin(user ? user : req.session.user ?? anonymousUser)
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

        const redirectProp =
          results?.props &&
          (results.props as Record<string, boolean>).requireAuthenticated &&
          user.anonymous
            ? {
                permanent: false,
                destination: '/401',
              }
            : undefined;

        return {
          ...results,
          redirect: redirectProp,
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
