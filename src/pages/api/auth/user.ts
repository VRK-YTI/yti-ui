import { anonymousUser } from '@app/common/interfaces/user.interface';
import withSession from '@app/common/utils/session';

export default withSession(async (req, res) => {
  const user = req.session.get('user');

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
});
