import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '../axios-base-query';
import { HYDRATE } from 'next-redux-wrapper';
import { Subscription } from '../../interfaces/subscription.interface';

export const subscriptionApi = createApi({
  reducerPath: 'subsriptionApi',
  baseQuery: axiosBaseQuery({
    baseUrl: process.env.MESSAGING_API_URL
      ? `${process.env.MESSAGING_API_URL}/api/v1`
      : '/messaging-api/api/v1',
  }),
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  tagTypes: ['Subscription'],
  endpoints: (builder) => ({
    getSubscription: builder.query<Subscription | '', string>({
      query: (url) => ({
        url:
          process.env.NODE_ENV === 'development'
            ? '/subscriptions?fake.login.mail=admin@localhost'
            : '/subscriptions',
        method: 'POST',
        data: {
          action: 'GET',
          uri: url,
        },
      }),
    }),
    getSubscriptions: builder.query<any, null>({
      query: () => ({
        url:
          process.env.NODE_ENV === 'development'
            ? '/user?fake.login.mail=admin@localhost'
            : '/user',
        method: 'GET',
      }),
    }),
    toggleSubscription: builder.mutation<any, 'DAILY' | 'DISABLED'>({
      query: (subscriptionType) => ({
        url:
          process.env.NODE_ENV === 'development'
            ? '/user/subscriptiontype?fake.login.mail=admin@localhost'
            : '/user/subscriptiontype',
        method: 'POST',
        data: {
          subscriptionType: subscriptionType
        }
      }),
    })
  }),
});

export const {
  useGetSubscriptionQuery,
  useGetSubscriptionsQuery,
  useToggleSubscriptionMutation,
  util: { getRunningOperationPromises },
} = subscriptionApi;

export const { getSubscription } = subscriptionApi.endpoints;
