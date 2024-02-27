import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
  anonymousUser,
  User,
  UserProps,
} from 'yti-common-ui/interfaces/user.interface';
import withSession from './session';
import { AppStore, wrapper } from '@app/store';
import { ParsedUrlQuery } from 'querystring';
import { SSRConfig } from 'next-i18next';
import {
  getAuthenticatedUser,
  getRunningQueriesThunk,
  setLogin,
} from '@app/common/components/login/login.slice';
import { CommonContextState } from 'yti-common-ui/common-context-provider';
// import { setAdminControls } from '../components/admin-controls/admin-controls.slice';
import { getStoreData } from './utils';
import {
  getFakeableUsers,
  getRunningQueriesThunk as getFakeableRunningQueriesThunk,
} from '../components/fakeable-users/fakeable-users.slice';
import { FakeableUser } from '../interfaces/fakeable-user.interface';
import { isEqual } from 'lodash';

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

        store.dispatch(getAuthenticatedUser.initiate());
        await Promise.all(store.dispatch(getRunningQueriesThunk()));

        const user: User = getStoreData({
          state: store.getState(),
          reduxKey: 'loginApi',
          functionKey: 'getAuthenticatedUser',
        });

        if (!user || user.anonymous) {
          store.dispatch(setLogin(anonymousUser));
        } else {
          store.dispatch(
            setLogin(user ? user : req.session.user ?? anonymousUser)
          );
        }

        if (process.env.ENV_TYPE !== 'production') {
          store.dispatch(getFakeableUsers.initiate());
          await Promise.all(store.dispatch(getFakeableRunningQueriesThunk()));
        }

        const fakeableUsers: FakeableUser[] = getStoreData({
          state: store.getState(),
          reduxKey: 'fakeableUsers',
          functionKey: 'getFakeableUsers',
        });

        // store.dispatch(
        //   setAdminControls(process.env.ADMIN_CONTROLS_DISABLED === 'true')
        // );

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
                destination: '/',
              }
            : undefined;

        return {
          ...results,
          ...(redirectProp && { redirect: redirectProp }),
          props: {
            ...resultsProps,
            ...(await serverSideTranslations(locale ?? 'fi', [
              'admin',
              'alert',
              'common',
            ])),
            isSSRMobile: Boolean(
              userAgent.match(
                /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
              )
            ),
            isMatomoEnabled: process.env.MATOMO_ENABLED === 'true',
            matomoUrl: process.env.MATOMO_URL ?? null,
            matomoSiteId: process.env.MATOMO_SITE_ID ?? null,
            user: user ?? null,
            fakeableUsers:
              !fakeableUsers || isEqual(fakeableUsers, {})
                ? null
                : fakeableUsers,
          },
        };
      }
    );
  }) as CreateCommonGetServerSidePropsResult<T>;
}
