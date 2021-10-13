import { anonymousUser } from '../../../common/interfaces/user-interface';
import withSession from '../../../common/utils/session';

export default withSession(async (req, res) => {
  // invalidate cookie
  res.setHeader('Set-Cookie', 'JSESSIONID=deleted; path=/terminology-api; expires=Thu, 01 Jan 1970 00:00:00 GMT');

  req.session.destroy();
  res.json({ ...anonymousUser });
});
