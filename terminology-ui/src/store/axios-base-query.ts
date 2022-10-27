import { BaseQueryFn } from '@reduxjs/toolkit/dist/query';
import { BaseQueryApi } from '@reduxjs/toolkit/dist/query/baseQueryTypes';
import { MaybePromise } from '@reduxjs/toolkit/dist/query/tsHelpers';
import axios, { AxiosRequestConfig, AxiosRequestHeaders } from 'axios';
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

export type AxiosBaseQueryError =
  | {
      status: number;
      data: unknown;
    }
  | {
      status: 'GENERIC_ERROR';
      data?: undefined;
      error: string;
    };

const axiosBaseQuery =
  (
    { baseUrl, prepareHeaders }: AxiosBaseQuery = { baseUrl: '/' }
  ): BaseQueryFn<AxiosBaseQueryArgs, unknown, AxiosBaseQueryError> =>
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
    } catch (error) {
      if (!axios.isAxiosError(error) || !error.response) {
        return {
          error: {
            status: 'GENERIC_ERROR',
            error: (error as Error)?.message,
          },
        };
      }

      const response = error.response;
      return {
        error: {
          status: response.status,
          data: response.data,
        },
      };
    }
  };

export default axiosBaseQuery;
