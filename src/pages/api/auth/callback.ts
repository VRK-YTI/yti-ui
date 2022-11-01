import axios from 'axios';
import { userCookieOptions } from '@app/common/utils/user-cookie-options';
import { User } from '@app/common/interfaces/user.interface';
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
      console.log(`Found _shibsession: ${shibsession_value}`);
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
        process.env.TERMINOLOGY_API_URL ??
        'http://yti-terminology-api:9103/terminology-api';
      const apiPath = new URL(apiBase).pathname;
      const fetchUrl =
        proxyUrl + apiPath + '/api/v1/frontend/authenticated-user';
      console.log(`fetchUrl: ${fetchUrl}`);

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
      console.log('authenticated-user reports user:');
      console.log(user);

      // Pass the cookie from the api to the client.
      // This works since the API is already in the same domain,
      // just has a more specific Path set
      const jsessionid = (response.headers['set-cookie'] as string[]).filter(
        (x) => x.startsWith('JSESSIONID=')
      );
      if (jsessionid.length > 0) {
        console.log(`found JSESSIONID: ${jsessionid}`);
        console.log('full headers');
        console.log(response.headers);
        res.setHeader('Set-Cookie', jsessionid);
      } else {
        console.warn('No JSESSIONID found in response');
      }

      // Collect cookies from Set-Cookie into an object.
      // These will be saved in the session for later use.
      (response.headers['set-cookie'] as string[])
        .map((x) => x.split(';')[0])
        .forEach((x) => {
          const [key, value] = x.split('=');
          cookies[key] = value;
          console.log(`assigning to session ${key}=${value}`);
        });
    } catch (error) {
      if (axios.isAxiosError(error)) {
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
      console.log('building session');
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
