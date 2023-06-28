import axios, { isAxiosError } from 'axios';
import { User } from 'yti-common-ui/interfaces/user.interface';
import { userCookieOptions } from '@app/common/utils/user-cookie-options';
import { withIronSessionApiRoute } from 'iron-session/next';

export default withIronSessionApiRoute(
  async function fakeLogin(req, res) {
    if (process.env.ENV_TYPE === 'production') {
      res.status(403).json({ msg: 'Access denied' });
      return;
    }

    const withAuthProxy =
      process.env.TERMINOLOGY_API_URL?.includes('yti-auth-proxy');

    let user: User | null = null;
    const cookies: { [key: string]: string } = {};
    const target = (req.query['target'] as string) ?? '/';
    const email = (req.query['fake.login.mail'] as string) ?? 'admin@localhost';

    try {
      let fetchUrl: string =
        process.env.TERMINOLOGY_API_URL + '/api/v1/frontend/authenticated-user';
      fetchUrl += '?fake.login.mail=' + encodeURIComponent(email);

      let authProxyHeaders = {};

      if (withAuthProxy) {
        const forwardedFor = req.headers['x-forwarded-for'] as string;
        const host = req.headers['host'] as string;

        authProxyHeaders = {
          Host: host,
          'X-Forwarded-For': forwardedFor,
        };
      }

      const response = await axios.get(fetchUrl, {
        headers: {
          'Content-Type': 'application/json',
          ...authProxyHeaders,
        },
      });

      // should receive a fake user on success
      user = response.data;

      if (user && user.anonymous) {
        console.warn(
          'User from response appears to be anonymous, login may have failed'
        );
      }

      // Pass the cookie from the api to the client.
      // This works since the API is already in the same domain,
      // just has a more specifi Path set
      const jsessionid = (response.headers['set-cookie'] as string[]).filter(
        (x) => x.startsWith('JSESSIONID=')
      );
      if (jsessionid.length > 0) {
        res.setHeader('Set-Cookie', jsessionid);
      }

      // Collect cookies from Set-Cookie into an object.
      // These will be saved in the session for later use.
      (response.headers['set-cookie'] as string[])
        .map((x) => x.split(';')[0])
        .forEach((x) => {
          const [key, value] = x.split('=');
          cookies[key] = value;
        });
    } catch (error) {
      if (isAxiosError(error)) {
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
      // await applySession(req, res, userCookieOptions);
      req.session.user = user;

      // cookies are stored in session for use with API calls in getServerSideProps
      req.session.cookies = cookies;

      await req.session.save();
    } else {
      console.error('API error: Cookie not available');
    }

    res.redirect(target);
  },
  {
    ...userCookieOptions,
  }
);
