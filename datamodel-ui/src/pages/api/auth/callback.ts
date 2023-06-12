import axios, { isAxiosError } from 'axios';
import { userCookieOptions } from '@app/common/utils/user-cookie-options';
import { User } from 'yti-common-ui/interfaces/user.interface';
import { withIronSessionApiRoute } from 'iron-session/next';

export default withIronSessionApiRoute(
  async function callback(req, res) {
    // returned from Shibboleth, let's go back to target

    // user will be stored here after we verify it from authenticated-user
    let user: User | null = null;

    // collect cookies from request here, so we can re-use the shibboleth cookie
    const cookies: { [key: string]: string } = {};

    // after we're done, redirect here
    const target = (req.query['target'] as string) ?? '/';

    // look for thie shibboleth session
    const shibsession_key = Object.keys(req.cookies).find((x) =>
      x.startsWith('_shibsession')
    );

    let shibsession_value = '';
    if (shibsession_key !== undefined) {
      shibsession_value = req.cookies[shibsession_key] ?? '';
    } else {
      console.warn('No shibsression found, login failed');
      res.redirect(target);
      return;
    }

    try {
      // API call must go through auth-proxy to handle shibboleth session.
      // After this, once we successfully get a JSESSIONID, we can bypass the proxy.
      const proxyUrl = process.env.AUTH_PROXY_URL ?? 'http://yti-auth-proxy';
      const apiBase =
        process.env.DATAMODEL_API_URL ??
        'http://yti-datamodel-api:9004/datamodel-api';
      const apiPath = new URL(apiBase).pathname;
      const fetchUrl = proxyUrl + apiPath + '/v2/user';

      // Shibboleth configuration requires X-Forwarded-For to allow access with
      // the _shibsession cookie. Otherwise the "consistentAddress" setting will
      // invalidate the session.
      const forwardedFor = req.headers['x-forwarded-for'] as string;
      if (!forwardedFor) {
        console.error('Header "X-Forwarded-For" not found!');
        res.redirect(target);
        return;
      }

      // Host header is required to access the correct site in the shibboleth
      // container
      const host = req.headers['host'] as string;
      if (!host) {
        console.error('Header "Host" not found!');
        res.redirect(target);
        return;
      }

      const response = await axios.get(fetchUrl, {
        headers: {
          'Content-Type': 'application/json',
          Host: host,
          'X-Forwarded-For': forwardedFor,
          Cookie: shibsession_key + '=' + shibsession_value,
        },
      });
      // should receive a proper user if correctly authenticated
      user = response.data;
      if (user && user.anonymous) {
        console.warn(
          'User from response appears to be anonymous, login may have failed'
        );
      }

      // Pass the cookie from the api to the client.
      // This works since the API is already in the same domain,
      // just has a more specific Path set
      if (response.headers['set-cookie']) {
        // Collect cookies from Set-Cookie into an object.
        // These will be saved in the session for later use.
        (response.headers['set-cookie'] as string[])
          .map((x) => x.split(';')[0])
          .forEach((x) => {
            const [key, value] = x.split('=');
            cookies[key] = value;
          });
      }
    } catch (error) {
      if (isAxiosError(error)) {
        // handleAxiosError(error);
      } else {
        // handleUnexpectedError(error);
      }

      console.error('Caught error from axios');
      console.error(error);

      // TODO: redirect instead with some error status
      res.status(500).json(error);
    }

    if (user !== null && cookies !== null) {
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
