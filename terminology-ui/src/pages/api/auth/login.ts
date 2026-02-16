import { NextApiRequest, NextApiResponse } from 'next';

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  // eventually we want to return to this path
  let target = req.query['target'] ?? '/';

  // but SSO should first return to auth callback
  target = '/api/auth/callback?target=' + target;

  const path = `/Shibboleth.sso/Login?target=${encodeURIComponent(
    target as string
  )}`;
  res.redirect(path);
}
