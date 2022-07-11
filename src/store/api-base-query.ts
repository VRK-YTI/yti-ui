import { AxiosRequestHeaders } from 'axios';
import axiosBaseQuery from './axios-base-query';

export const getTerminologyApiBaseQuery = (
  getAdditionalHeaders?: (headers: AxiosRequestHeaders) => AxiosRequestHeaders
) =>
  axiosBaseQuery({
    baseUrl: process.env.TERMINOLOGY_API_URL
      ? `${process.env.TERMINOLOGY_API_URL}/api/v1/frontend`
      : '/terminology-api/api/v1/frontend',

    // prepareHeaders is used to take the JSESSIONID stored in session
    // and provide it as a cookie for API calls
    prepareHeaders: ({ extra: ctx }) => {
      const cookies: { [key: string]: string } = {};

      let session_id: string | null = null;

      // narrow down type to NextIronRequest
      if ('req' in ctx && ctx.req && 'session' in ctx.req) {
        session_id = ctx.req.session?.get('cookies')?.['JSESSIONID'] ?? null;

        // assign JSESSIONID to cookie
        if (session_id) {
          cookies['JSESSIONID'] = session_id;
        }
      }

      let headers: AxiosRequestHeaders = {
        'content-type': 'application/json',
      };

      // prepare cookie header; this should only happen in SSR, since ctx.req
      // is empty on browser
      if (Object.keys(cookies).length > 0) {
        const cookiestring = Object.entries(cookies)
          .map(([k, v]) => `${k}=${v}`) // rfc6265
          .join('; ');
        headers['Cookie'] = cookiestring;
      }

      // additional custom headers from slices. typically would be for a
      // different content-type
      if (getAdditionalHeaders) {
        headers = getAdditionalHeaders(headers);
      }

      return headers;
    },
  });
