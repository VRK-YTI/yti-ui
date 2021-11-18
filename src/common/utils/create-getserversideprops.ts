import { GetServerSideProps, NextApiResponse } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import User, { anonymousUser, UserProps } from '../interfaces/user-interface';
import withSession, { NextIronRequest } from './session';
import { AppStore, wrapper } from '../../store';

export type localHandler<T> =
  ((context: {
    req: NextIronRequest;
    res: NextApiResponse;
    locale: string;
    store: AppStore;
  }) => Promise<T>);

export const createCommonGetServerSideProps =
  (handler: localHandler<{ [key: string]: any }>): GetServerSideProps<UserProps> =>
    wrapper.getServerSideProps((store) =>
      withSession<{ props: UserProps }>(
        async ({ req, res, locale }: { req: NextIronRequest, res: NextApiResponse, locale: string }) => {
          console.log('SSR state:');
          console.log(store.getState());
          const results = await handler({ req, res, locale, store });
          let sessionUser = req.session.get<User>('user') || anonymousUser;

          const userAgent = req.headers['user-agent'] ?? '';

          return {
            ...results,
            props: {
              ...results.props,
              ...(await serverSideTranslations(locale, ['common'])),
              user: sessionUser,
              isSSRMobile: Boolean(userAgent.match(
                /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
              )),
            },
          };
        }));
