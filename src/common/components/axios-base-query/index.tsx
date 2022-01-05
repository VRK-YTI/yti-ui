import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { BaseQueryFn } from '@reduxjs/toolkit/query';

const axiosBaseQuery = ({ baseUrl }: { baseUrl: string } = { baseUrl: '' }):
  BaseQueryFn<
    {
      url: string;
      method: AxiosRequestConfig['method'];
      data?: AxiosRequestConfig['data'];
    },
    unknown,
    unknown
  > =>
  async ({ url, method, data }) => {
    try {
      const result = await axios({
        url: baseUrl + url,
        headers: { 'content-type': 'application/json' },
        method,
        data
      });
      return { data: result.data };
    } catch (axiosError) {
      let error = axiosError as AxiosError;
      return {
        error: { status: error.response?.status, data: error.response?.data }
      };
    }
  };

export default axiosBaseQuery;
