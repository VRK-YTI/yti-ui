import { GetServerSideProps, NextApiResponse } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import User, { anonymousUser, UserProps } from '../interfaces/user-interface';
import withSession, { NextIronRequest } from './session';

export type localHandler<T> =
  ((context: {
    req: NextIronRequest;
    res: NextApiResponse;
    locale: string;
  }) => Promise<T>);

export const createCommonGetServerSideProps =
  (handler: localHandler<{ [key: string]: any }>): GetServerSideProps<UserProps> =>
    withSession<{ props: UserProps }>(
      async ({ req, res, locale }: { req: NextIronRequest, res: NextApiResponse, locale: string }) => {
        const results = await handler({ req, res, locale });
        let sessionUser = req.session.get<User>('user') || anonymousUser;
        return {
          ...results,
          props: {
            ...results.props,
            ...(await serverSideTranslations(locale, ['common'])),
            user: sessionUser
          },
        };
      });
