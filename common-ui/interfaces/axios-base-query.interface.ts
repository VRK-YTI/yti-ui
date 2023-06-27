import { BaseQueryApi } from '@reduxjs/toolkit/dist/query/baseQueryTypes';
import { MaybePromise } from '@reduxjs/toolkit/dist/query/tsHelpers';
import { AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';
import { Context } from 'next-redux-wrapper';
import { NextApiRequest } from 'next';

export type NextIronContext = Context | (Context & { req: NextApiRequest });

export type AxiosBaseQuery = {
  baseUrl: string;
  prepareHeaders?: (
    api: Pick<BaseQueryApi, 'getState' | 'endpoint' | 'type' | 'forced'> & {
      extra: NextIronContext;
    }
  ) => MaybePromise<RawAxiosRequestHeaders>;
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
    }
  | AxiosQuerySpringError
  | AxiosQueryErrorFields;

export type AxiosQueryErrorFields = {
  status: number;
  data: {
    details: {
      field: string;
      rejectedValue: string;
      message: string;
    }[];
  };
};

export type AxiosQuerySpringError = {
  status: number;
  data: {
    status: number;
    title: string;
    type: string;
    detail: string;
    instance: string;
  };
};
