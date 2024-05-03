import { userCookieOptions } from '@app/common/utils/user-cookie-options';
import axios, { RawAxiosRequestHeaders } from 'axios';
import { withIronSessionApiRoute } from 'iron-session/next';

export default withIronSessionApiRoute(
  async function getModelAsFile(req, res) {
    const target = (req.query['modelId'] as string) ?? '/';
    const version = (req.query['version'] as string) ?? '';
    const fileType = (req.query['fileType'] as string) ?? 'LD-JSON';
    const isRaw = (req.query['raw'] as string) ?? 'false';
    const language = (req.query['language'] as string) ?? 'fi';
    let filename = (req.query['filename'] as string) ?? 'datamodel';

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
      case 'OpenAPI':
        mimeType = 'application/vnd+oai+openapi+json';
        filename += '.json';
        break;
      case 'JSONSchema':
        mimeType = 'application/schema+json';
        filename += '.schema.json';
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
        ? process.env.DATAMODEL_API_URL
        : `${process.env.AUTH_PROXY_URL}/datamodel-api`;

    const { status, data: response } = await axios.get(
      `${apiUrl}/v2/export/${target}?language=${language}${
        version ? `&version=${version}` : ''
      }`,
      {
        headers: headers,
        responseType: 'stream',
        decompress: false,
      }
    );

    if (isRaw === 'true') {
      res.setHeader('Content-Type', 'text/plain; charset=UTF-8');
    } else {
      res.setHeader('Content-Type', mimeType);
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${filename}"`
      );
    }
    res.status(status);
    response.pipe(res);
  },
  {
    ...userCookieOptions,
  }
);
