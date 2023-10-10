import { userCookieOptions } from '@app/common/utils/user-cookie-options';
import axios, { RawAxiosRequestHeaders } from 'axios';
import { withIronSessionApiRoute } from 'iron-session/next';

export default withIronSessionApiRoute(
  async function getModelAsFile(req, res) {
    const target = (req.query['modelId'] as string) ?? '/';
    const version = (req.query['version'] as string) ?? '';
    const fileType = (req.query['fileType'] as string) ?? 'LD-JSON';
    const isRaw = (req.query['raw'] as string) ?? 'false';
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

    const { status, data: response } = await axios.get(
      `${process.env.DATAMODEL_API_URL}/v2/export/${target}${
        version ? `?version=${version}` : ''
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
