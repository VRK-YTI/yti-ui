import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '../axios-base-query';
import { HYDRATE } from 'next-redux-wrapper';
import { Subscription } from '../../interfaces/subscription.interface';

export const subsriptionApi = createApi({
  reducerPath: 'subsriptionApi',
  baseQuery: axiosBaseQuery({ baseUrl: process.env.MESSAGING_API_URL
    ?
    `${process.env.MESSAGING_API_URL}/api/v1`
    :
    '/messaging-api/api/v1' }),
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  tagTypes: ['Subscription'],
  endpoints: builder => ({
    getSubscription: builder.query<Subscription | null, string>({
      query: (url) => ({
        url: '/subscriptions/',
        method: 'POST',
        data: {
          action: 'GET',
          uri: url
        }
      })
    })
  }),
});

export const {
  useGetSubscriptionQuery,
  util: { getRunningOperationPromises }
} = subsriptionApi;

export const { getSubscription } = subsriptionApi.endpoints;
