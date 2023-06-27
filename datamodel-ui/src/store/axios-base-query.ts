import { BaseQueryFn } from '@reduxjs/toolkit/dist/query';
import { BaseQueryApi } from '@reduxjs/toolkit/dist/query/baseQueryTypes';
import axios, { RawAxiosRequestHeaders, isAxiosError } from 'axios';
import { NextIronContext } from '.';
import {
  AxiosBaseQuery,
  AxiosBaseQueryArgs,
  AxiosBaseQueryError,
} from 'yti-common-ui/interfaces/axios-base-query.interface';

const axiosBaseQuery =
  (
    { baseUrl, prepareHeaders }: AxiosBaseQuery = { baseUrl: '/' }
  ): BaseQueryFn<AxiosBaseQueryArgs, unknown, AxiosBaseQueryError> =>
  async ({ url, method, data, params }, api) => {
    let headers: RawAxiosRequestHeaders = {};
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
      if (!isAxiosError(error) || !error.response) {
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
