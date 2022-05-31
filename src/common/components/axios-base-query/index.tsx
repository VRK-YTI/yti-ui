import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { BaseQueryFn } from '@reduxjs/toolkit/query';
import { Error } from '@app/common/interfaces/error.interface';

const axiosBaseQuery = (
  { baseUrl }: { baseUrl: string } = { baseUrl: '' }
): BaseQueryFn<
  {
    url: string;
    method: AxiosRequestConfig['method'];
    data?: AxiosRequestConfig['data'];
  },
  unknown,
  Error
> => {
  return async ({ url, method, data }) => {
    try {
      const result = await axios({
        url: baseUrl + url,
        headers: { 'content-type': 'application/json' },
        method,
        data,
      });
      return { data: result.data };
    } catch (axiosError) {
      const error = axiosError as AxiosError;
      return {
        error: {
          status: error.response?.status,
          data: error.response?.data,
        } as Error,
      };
    }
  };
};

export default axiosBaseQuery;
