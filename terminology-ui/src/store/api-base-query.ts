import { RawAxiosRequestHeaders } from 'axios';
import axiosBaseQuery from './axios-base-query';

export const getTerminologyApiBaseQuery = (
  getAdditionalHeaders?: (
    headers: RawAxiosRequestHeaders
  ) => RawAxiosRequestHeaders
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
        session_id = ctx.req.session?.cookies?.['JSESSIONID'] ?? null;

        // assign JSESSIONID to cookie
        if (session_id) {
          cookies['JSESSIONID'] = session_id;
        }
      }

      // Additionally, if the browser provided us with _shibsession_..., pass
      // it to the request as well. This helps with cases where JSESSIONID
      // isn't enough for the spring API.
      if ('req' in ctx && ctx.req && 'cookies' in ctx.req) {
        const shibCookies = Object.keys(ctx.req.cookies).filter((x) =>
          x.startsWith('_shibsession')
        );

        for (const key of shibCookies) {
          const val = ctx.req.cookies[key];
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
      if (
        'req' in ctx &&
        ctx.req &&
        'headers' in ctx.req &&
        ctx.req.headers['x-forwarded-for'] !== undefined
      ) {
        const hdr = Array.isArray(ctx.req.headers['x-forwarded-for'])
          ? ctx.req.headers['x-forwarded-for'][0]
          : ctx.req.headers['x-forwarded-for'];
        headers['X-Forwarded-For'] = hdr;
      }

      // Host needs to match client requests or Shibboleth will
      // invalidate the session
      if (
        'req' in ctx &&
        ctx.req &&
        'headers' in ctx.req &&
        ctx.req.headers['host'] !== undefined
      ) {
        const hdr = Array.isArray(ctx.req.headers['host'])
          ? ctx.req.headers['host'][0]
          : ctx.req.headers['host'];
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
    },
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
    prepareHeaders: ({ extra: ctx }) => {
      const cookies: { [key: string]: string } = {};

      let session_id: string | null = null;

      // narrow down type to NextIronRequest
      if ('req' in ctx && ctx.req && 'session' in ctx.req) {
        session_id = ctx.req.session?.cookies?.['JSESSIONID'] ?? null;

        // assign JSESSIONID to cookie
        if (session_id) {
          cookies['JSESSIONID'] = session_id;
        }
      }

      // Additionally, if the browser provided us with _shibsession_..., pass
      // it to the request as well. This helps with cases where JSESSIONID
      // isn't enough for the spring API.
      if ('req' in ctx && ctx.req && 'cookies' in ctx.req) {
        const shibCookies = Object.keys(ctx.req.cookies).filter((x) =>
          x.startsWith('_shibsession')
        );

        for (const key of shibCookies) {
          const val = ctx.req.cookies[key];
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
      if (
        'req' in ctx &&
        ctx.req &&
        'headers' in ctx.req &&
        ctx.req.headers['x-forwarded-for'] !== undefined
      ) {
        const hdr = Array.isArray(ctx.req.headers['x-forwarded-for'])
          ? ctx.req.headers['x-forwarded-for'][0]
          : ctx.req.headers['x-forwarded-for'];
        headers['X-Forwarded-For'] = hdr;
      }

      // Host needs to match client requests or Shibboleth will
      // invalidate the session
      if (
        'req' in ctx &&
        ctx.req &&
        'headers' in ctx.req &&
        ctx.req.headers['host'] !== undefined
      ) {
        const hdr = Array.isArray(ctx.req.headers['host'])
          ? ctx.req.headers['host'][0]
          : ctx.req.headers['host'];
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
    },
  });

export const getCodeListApiBaseQuery = () =>
  axiosBaseQuery({
    baseUrl: process.env.CODELIST_API_URL
      ? `${process.env.CODELIST_API_URL}/api/v1`
      : '/codelist-api/api/v1',
  });
