import { userCookieOptions } from '@app/common/utils/user-cookie-options';
import axios, { RawAxiosRequestHeaders } from 'axios';
import { withIronSessionApiRoute } from 'iron-session/next';

export default withIronSessionApiRoute(
  async function redirect(req, res) {
    const modelId = req.query['modelId'];
    const resourceId = req.query['resourceId'];

    if (!modelId) {
      res.redirect('/');
      return;
    }

    const headers: RawAxiosRequestHeaders = {};

    const forwardedFor = req.headers['x-forwarded-for'] as string;
    if (forwardedFor) {
      headers['x-forwarded-for'] = forwardedFor;
    }
    const host = req.headers['host'] as string;
    if (host) {
      headers['host'] = host;
    }

    const sessionCookies = req.session.cookies ?? {};

    const cookieString = Object.entries(sessionCookies)
      .map(([key, value]) => {
        if (key.toLowerCase() === 'jsessionid') {
          return `JSESSIONID=${value}`;
        } else if (key.toLowerCase().startsWith('_shibsession')) {
          return `${key}=${value}`;
        }
      })
      .filter(Boolean)
      .join('; ');

    headers['Cookie'] = cookieString;

    const apiUrl =
      process.env.AWS_ENV === 'local'
        ? process.env.DATAMODEL_API_URL
        : `${process.env.AUTH_PROXY_URL}/datamodel-api`;

    // redirect based on location header
    try {
      const result = await axios.get(
        `${apiUrl}/v2/resolve/v1?modelId=${modelId}${
          resourceId ? `&resourceId=${resourceId}` : ''
        }`,
        {
          maxRedirects: 0,
          validateStatus: () => true,
          headers: headers,
        }
      );

      const redirectUrl = result.headers['location'];
      res.redirect(redirectUrl ?? '/');
    } catch (e) {
      res.redirect('/');
    }
  },
  {
    ...userCookieOptions,
  }
);
