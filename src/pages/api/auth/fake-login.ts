import axios from 'axios';
import { NextApiResponse } from 'next';
import { applySession } from 'next-iron-session';
import User, { anonymousUser } from '../../..//common/interfaces/user-interface';
import { NextIronRequest } from '../../../common/utils/session';
import { userCookieOptions } from '../../../common/utils/user-cookie-options';

const fakeLogin = async (req: NextIronRequest, res: NextApiResponse) => {
  if (process.env.ENV_TYPE === 'production') {
    //TODO: confirm env_type setup at first production usage
    res.status(403).json({ msg: 'Access denied' });
    return;
  }

  try {
    await getFakeUser(req, res);
  } catch (error) {
    console.error('error in api/auth/user.ts');
    res.status(400).json({ error });
  }
};

export default fakeLogin;

async function getFakeUser(
  req: NextIronRequest,
  res: NextApiResponse
): Promise<void> {
  let fetchUrl: string = process.env.TERMINOLOGY_API_URL + '/api/v1/frontend/authenticated-user';
  fetchUrl += '?fake.login.mail=admin@localhost';
  await fetchFakeUser(fetchUrl, req, res);
}

async function fetchFakeUser(
  url: string,
  req: NextIronRequest,
  res: NextApiResponse
): Promise<void> {

  let user: User | null = null;
  let cookies: { [key: string]: string } = {};
  try {
    const response = await axios.get(url,
      {
        headers: { 'Content-Type': 'application/json', }
      });
    user = response.data;

    // Pass the cookie from the api to the client.
    // This works since the API is already in the same domain,
    // just has a more specifi Path set
    const jsessionid = (<string[]> response.headers['set-cookie'])
      .filter(x => x.startsWith('JSESSIONID='));
    if (jsessionid.length > 0) {
      res.setHeader('Set-Cookie', jsessionid);
    }

    // collect cookies from Set-Cookie into an object
    (<string[]> response.headers['set-cookie'])
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

    console.error(error);
    // throw error;
    // return anonymousUser;
    res.status(500).json(anonymousUser);
  }

  if (user !== null && cookies !== null) {
    await applySession(req, res, userCookieOptions);
    req.session.set('user', user);
    // cookies are stored in session for use with API calls in getServerSideProps
    req.session.set('cookies', cookies);
    await req.session.save();
    res.status(200).json(user);
  } else {
    console.error('API error: Cookie not available');
    res.status(400).json(anonymousUser);
  }
}
