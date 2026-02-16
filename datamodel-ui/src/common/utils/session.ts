import { GetServerSidePropsContext } from 'next';
import { getIronSession, IronSession } from 'iron-session';
import { sessionOptions, SessionData } from './user-cookie-options';

export async function getSession(
  req: GetServerSidePropsContext['req'],
  res: GetServerSidePropsContext['res']
): Promise<IronSession<SessionData>> {
  return getIronSession<SessionData>(req, res, sessionOptions);
}

// Type for request with session attached (used for SSR cookie forwarding)
export type RequestWithSession = GetServerSidePropsContext['req'] & {
  session: IronSession<SessionData>;
};
