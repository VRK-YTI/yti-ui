// this file is a wrapper with defaults to be used in both API routes and `getServerSideProps` functions
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { withIronSessionSsr } from 'iron-session/next';
import { userCookieOptions } from './user-cookie-options';

function withSession<
  P extends { [key: string]: unknown } = { [key: string]: unknown }
>(
  handler: (
    context: GetServerSidePropsContext
  ) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>
) {
  return withIronSessionSsr(handler, userCookieOptions);
}

export default withSession;
