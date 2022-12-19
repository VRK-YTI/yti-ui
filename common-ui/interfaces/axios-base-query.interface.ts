import { BaseQueryApi } from '@reduxjs/toolkit/dist/query/baseQueryTypes';
import { MaybePromise } from '@reduxjs/toolkit/dist/query/tsHelpers';
import { AxiosRequestConfig, AxiosRequestHeaders } from 'axios';
import { Context } from 'next-redux-wrapper';
import { NextApiRequest } from 'next';

export type NextIronContext = Context | (Context & { req: NextApiRequest });

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
