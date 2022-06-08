import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { BaseQueryFn } from '@reduxjs/toolkit/query';
import { Error } from '@app/common/interfaces/error.interface';

const axiosBaseQuery = (
  { baseUrl }: { baseUrl: string } = { baseUrl: '' },
  { headers }: { headers?: { [key: string]: string } } = { headers: {} }
): BaseQueryFn<
  {
    url: string;
    method: AxiosRequestConfig['method'];
    data?: AxiosRequestConfig['data'];
    localHeaders?: { [key: string]: string };
  },
  unknown,
  Error
> => {
  return async ({ url, method, data, localHeaders }) => {
    const reqHeader = getHeader(headers, localHeaders);

    try {
      const result = await axios({
        url: baseUrl + url,
        headers: reqHeader ? reqHeader : { 'content-type': 'application/json' },
        method,
        data,
        withCredentials: true,
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

function getHeader(
  headers?: { [key: string]: string },
  localHeaders?: { [key: string]: string }
) {
  if (localHeaders) {
    return localHeaders;
  }

  if (headers) {
    return headers;
  }

  return null;
}

export default axiosBaseQuery;
