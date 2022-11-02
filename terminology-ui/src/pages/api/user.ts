import { userCookieOptions } from '@app/common/utils/user-cookie-options';
import { withIronSessionApiRoute } from 'iron-session/next';

export default withIronSessionApiRoute(
  function userRoute(req, res) {
    res.send({ user: req.session.user });
  },
  {
    ...userCookieOptions,
  }
);
