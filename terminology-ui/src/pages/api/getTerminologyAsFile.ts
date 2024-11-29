import { userCookieOptions } from '@app/common/utils/user-cookie-options';
import axios, { RawAxiosRequestHeaders } from 'axios';
import { withIronSessionApiRoute } from 'iron-session/next';

export default withIronSessionApiRoute(
  async function getModelAsFile(req, res) {
    const prefix = (req.query['prefix'] as string) ?? '';
    const fileType = (req.query['fileType'] as string) ?? 'LD+JSON';
    let filename = (req.query['filename'] as string) ?? 'terminology';

    let mimeType: string;
    switch (fileType) {
      case 'RDF':
        mimeType = 'application/rdf+xml';
        filename += '.rdf';
        break;
      case 'Turtle':
        mimeType = 'text/turtle';
        filename += '.ttl';
        break;
      case 'LD+JSON':
      default:
        mimeType = 'application/ld+json';
        filename += '.jsonld';
    }

    const headers: RawAxiosRequestHeaders = {
      Accept: mimeType,
    };

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
        ? process.env.TERMINOLOGY_API_URL
        : `${process.env.AUTH_PROXY_URL}/terminolgoy-api`;

    const { status, data: response } = await axios.get(
      `${apiUrl}/export/${prefix}`,
      {
        headers: headers,
        responseType: 'stream',
        decompress: false,
      }
    );

    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    res.status(status);
    response.pipe(res);
  },
  {
    ...userCookieOptions,
  }
);
