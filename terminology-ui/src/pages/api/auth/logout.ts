import { userCookieOptions } from '@app/common/utils/user-cookie-options';
import { withIronSessionApiRoute } from 'iron-session/next';

export default withIronSessionApiRoute(
  async function logout(req, res) {
    const target = (req.query['target'] as string) ?? '/';

    // invalidate cookie
    res.setHeader(
      'Set-Cookie',
      'JSESSIONID=deleted; path=/terminology-api; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    );

    req.session.destroy();
    res.redirect(target);
  },
  {
    ...userCookieOptions,
  }
);
