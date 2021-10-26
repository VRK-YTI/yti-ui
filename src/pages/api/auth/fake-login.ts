import axios from 'axios';
import { NextApiResponse } from 'next';
import { applySession } from 'next-iron-session';
import User from '../../..//common/interfaces/user-interface';
import { NextIronRequest } from '../../../common/utils/session';
import { userCookieOptions } from '../../../common/utils/user-cookie-options';

const fakeLogin = async (req: NextIronRequest, res: NextApiResponse) => {
  if (process.env.ENV_TYPE === 'production') {
    res.status(403).json({ msg: 'Access denied' });
    return;
  }

  // user will be stored here after we verify it from authenticated-user
  let user: User | null = null;

  // collect cookies from request here, so we can re-use the shibboleth cookie
  let cookies: { [key: string]: string } = {};

  // after we're done, redirect here
  const target = (req.query['target'] as string) ?? '/';

  try {
    let fetchUrl: string = process.env.TERMINOLOGY_API_URL + '/api/v1/frontend/authenticated-user';
    fetchUrl += '?fake.login.mail=admin@localhost';

    const response = await axios.get(
      fetchUrl,
      {
        headers: { 'Content-Type': 'application/json', }
      });

    // should receive a fake user on success
    user = response.data;
    if (user && user.anonymous) {
      console.warn('User from response appears to be anonymous, login may have failed');
    }

    // Pass the cookie from the api to the client.
    // This works since the API is already in the same domain,
    // just has a more specifi Path set
    const jsessionid = (response.headers['set-cookie'] as string[])
      .filter(x => x.startsWith('JSESSIONID='));
    if (jsessionid.length > 0) {
      res.setHeader('Set-Cookie', jsessionid);
    }

    // Collect cookies from Set-Cookie into an object.
    // These will be saved in the session for later use.
    (response.headers['set-cookie'] as string[])
      .map(x => x.split(';')[0])
      .forEach(x => {
        const [key, value] = x.split('=');
        cookies[key] = value;
      });

  } catch (error) {
    if (axios.isAxiosError(error)) {
      // handleAxiosError(error);
    } else {
      // handleUnexpectedError(error);
    }

    console.error('Caught error from axios');
    console.error(error);

    // TODO: add some error status to redirect
    res.redirect(target);
    return;
  }

  if (user !== null && cookies !== null) {
    await applySession(req, res, userCookieOptions);
    req.session.set('user', user);

    // cookies are stored in session for use with API calls in getServerSideProps
    req.session.set('cookies', cookies);

    await req.session.save();
  } else {
    console.error('API error: Cookie not available');
  }

  res.redirect(target);
};

export default fakeLogin;
