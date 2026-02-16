import { NextApiRequest, NextApiResponse } from 'next';
import { getIronSession } from 'iron-session';
import {
  sessionOptions,
  SessionData,
} from '@app/common/utils/user-cookie-options';

export default async function userRoute(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getIronSession<SessionData>(req, res, sessionOptions);
  res.send({ user: session.user });
}
