import { userCookieOptions } from '@app/common/utils/user-cookie-options';
import { withIronSessionApiRoute } from 'iron-session/next';

export default withIronSessionApiRoute(
  async function login(req, res) {
    // eventually we want to return to this path
    let target = req.query['target'] ?? '/';
    console.log(target);

    // but SSO should first return to auth callback
    target = '/api/auth/callback?target=' + target;

    const path = `/Shibboleth.sso/Login?target=${encodeURIComponent(target)}`;
    res.redirect(path);
  },
  {
    ...userCookieOptions,
  }
);
