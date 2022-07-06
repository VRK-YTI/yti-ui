import { BaseQueryFn } from '@reduxjs/toolkit/dist/query';
import { BaseQueryApi } from '@reduxjs/toolkit/dist/query/baseQueryTypes';
import { MaybePromise } from '@reduxjs/toolkit/dist/query/tsHelpers';
import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosRequestHeaders,
} from 'axios';
import { NextIronContext } from '.';

export type AxiosBaseQuery = {
  baseUrl: string;
  prepareHeaders?: (
    api: Pick<BaseQueryApi, 'getState' | 'endpoint' | 'type' | 'forced'> & {
      extra: NextIronContext;
    }
  ) => MaybePromise<AxiosRequestHeaders>;
};

export type AxiosBaseQueryArgs = {
  url: string;
  method: AxiosRequestConfig['method'];
  data?: AxiosRequestConfig['data'];
  params?: AxiosRequestConfig['params'];
};

const axiosBaseQuery =
  (
    { baseUrl, prepareHeaders }: AxiosBaseQuery = { baseUrl: '/' }
  ): BaseQueryFn<AxiosBaseQueryArgs, unknown, unknown> =>
  async ({ url, method, data, params }, api) => {
    let headers: AxiosRequestHeaders = {};
    if (prepareHeaders) {
      headers = await prepareHeaders(
        api as BaseQueryApi & { extra: NextIronContext }
      );
    }

    try {
      const result = await axios({
        url: baseUrl + url,
        method,
        data,
        params,
        headers: headers,
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };

export default axiosBaseQuery;
