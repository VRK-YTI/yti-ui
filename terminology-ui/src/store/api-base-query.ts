import { RawAxiosRequestHeaders } from 'axios';
import axiosBaseQuery from './axios-base-query';

// Type for SSR context with session attached to request
interface SSRContext {
  req?: {
    session?: {
      cookies?: { [key: string]: string };
    };
    cookies: Partial<{ [key: string]: string }>;
    headers: { [key: string]: string | string[] | undefined };
  };
}

// Helper function to prepare headers for SSR requests
function createPrepareHeaders(
  getAdditionalHeaders?: (
    headers: RawAxiosRequestHeaders
  ) => RawAxiosRequestHeaders
) {
  return ({ extra: ctx }: { extra: unknown }) => {
    // Cast to SSRContext - on client side, ctx.req will be undefined
    const ssrCtx = ctx as SSRContext;
    const cookies: { [key: string]: string } = {};

    let session_id: string | null = null;

    // Extract JSESSIONID from session if available
    if (ssrCtx.req?.session) {
      session_id = ssrCtx.req.session.cookies?.['JSESSIONID'] ?? null;

      // assign JSESSIONID to cookie
      if (session_id) {
        cookies['JSESSIONID'] = session_id;
      }
    }

    // Additionally, if the browser provided us with _shibsession_..., pass
    // it to the request as well. This helps with cases where JSESSIONID
    // isn't enough for the spring API.
    if (ssrCtx.req?.cookies) {
      const shibCookies = Object.keys(ssrCtx.req.cookies).filter((x) =>
        x.startsWith('_shibsession')
      );

      for (const key of shibCookies) {
        const val = ssrCtx.req.cookies[key];
        if (val !== undefined) {
          cookies[key] = val;
        }
      }
    }

    let headers: RawAxiosRequestHeaders = {
      'content-type': 'application/json',
    };

    // X-Forwarded-For needs to match client requests or Shibboleth will
    // invalidate the session
    if (ssrCtx.req?.headers?.['x-forwarded-for'] !== undefined) {
      const hdr = Array.isArray(ssrCtx.req.headers['x-forwarded-for'])
        ? ssrCtx.req.headers['x-forwarded-for'][0]
        : ssrCtx.req.headers['x-forwarded-for'];
      headers['X-Forwarded-For'] = hdr;
    }

    // Host needs to match client requests or Shibboleth will
    // invalidate the session
    if (ssrCtx.req?.headers?.['host'] !== undefined) {
      const hdr = Array.isArray(ssrCtx.req.headers['host'])
        ? ssrCtx.req.headers['host'][0]
        : ssrCtx.req.headers['host'];
      headers['Host'] = hdr;
    }

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
  };
}

export const getTerminologyApiBaseQuery = (
  getAdditionalHeaders?: (
    headers: RawAxiosRequestHeaders
  ) => RawAxiosRequestHeaders
) =>
  axiosBaseQuery({
    baseUrl: process.env.TERMINOLOGY_API_URL
      ? `${process.env.TERMINOLOGY_API_URL}`
      : '/terminology-api/v2',

    // prepareHeaders is used to take the JSESSIONID stored in session
    // and provide it as a cookie for API calls
    prepareHeaders: createPrepareHeaders(getAdditionalHeaders),
  });

export const getMessagingApiBaseQuery = (
  getAdditionalHeaders?: (
    headers: RawAxiosRequestHeaders
  ) => RawAxiosRequestHeaders
) =>
  axiosBaseQuery({
    baseUrl: process.env.MESSAGING_API_URL
      ? `${process.env.MESSAGING_API_URL}/api/v1`
      : '/messaging-api/api/v1',

    // prepareHeaders is used to take the JSESSIONID stored in session
    // and provide it as a cookie for API calls
    prepareHeaders: createPrepareHeaders(getAdditionalHeaders),
  });

export const getCodeListApiBaseQuery = () =>
  axiosBaseQuery({
    baseUrl: process.env.CODELIST_API_URL
      ? `${process.env.CODELIST_API_URL}/api/v1`
      : '/codelist-api/api/v1',
  });
