import { anonymousUser } from '@app/common/interfaces/user.interface';
import { userCookieOptions } from '@app/common/utils/user-cookie-options';
import { withIronSessionApiRoute } from 'iron-session/next';

/**
 * @deprecated Should /pages/api/user.ts instead of this
 */

export default withIronSessionApiRoute(
  async function user(req, res) {
    const user = req.session.user;

    if (user) {
      // in a real world application you might read the user id from the session and then do a database request
      // to get more information on the user if needed
      res.json({
        ...user,
      });
    } else {
      res.json({
        ...anonymousUser,
      });
    }
  },
  {
    ...userCookieOptions,
  }
);
