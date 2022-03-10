// this file is a wrapper with defaults to be used in both API routes and `getServerSideProps` functions
import { NextApiRequest, NextApiResponse } from 'next';
import { Session, withIronSession } from 'next-iron-session';
import { ParsedUrlQuery } from 'querystring';
import { userCookieOptions } from './user-cookie-options';

export type NextIronRequest = NextApiRequest & {
  session: Session;
  locale: string;
};

export type NextIronHandler<T> =
  | ((req: NextIronRequest, res: NextApiResponse) => void | Promise<void>)
  | ((context: {
      req: NextIronRequest;
      res: NextApiResponse;
      params: ParsedUrlQuery;
      locale: string;
    }) => T | Promise<T>);

const withSession = <T>(handler: NextIronHandler<T>) =>
  withIronSession(handler, {
    ...userCookieOptions,
  });

export default withSession;
