import { userCookieOptions } from '@app/common/utils/user-cookie-options';
import axios from 'axios';
import { withIronSessionApiRoute } from 'iron-session/next';

export default withIronSessionApiRoute(
  async function getModelAsFile(req, res) {
    const target = (req.query['modelId'] as string) ?? '/';
    const fileType = (req.query['fileType'] as string) ?? 'LD-JSON';
    const isRaw = (req.query['raw'] as string) ?? 'false';

    let mimeType: string;
    switch (fileType) {
      case 'RDF':
        mimeType = 'application/rdf+xml';
        break;
      case 'Turtle':
        mimeType = 'text/turtle';
        break;
      case 'LD+JSON':
      default:
        mimeType = 'application/ld+json';
    }

    const { status, data: response } = await axios.get(
      `${process.env.DATAMODEL_API_URL}/v2/model/${target}/file`,
      {
        headers: {
          Accept: mimeType,
        },
        responseType: 'stream',
        decompress: false,
      }
    );

    if (isRaw === 'true') {
      res.setHeader('Content-Type', 'text/plain; charset=UTF-8');
    } else {
      res.setHeader('Content-Type', mimeType);
      res.setHeader('Content-Disposition', 'attachment');
    }
    res.status(status);
    response.pipe(res);
  },
  {
    ...userCookieOptions,
  }
);
