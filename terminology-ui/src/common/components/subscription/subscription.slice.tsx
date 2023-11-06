import { createApi } from '@reduxjs/toolkit/query/react';
import { getMessagingApiBaseQuery } from '@app/store/api-base-query';
import {
  Subscription,
  Subscriptions,
} from '@app/common/interfaces/subscription.interface';

export const subscriptionApi = createApi({
  reducerPath: 'subsriptionApi',
  baseQuery: getMessagingApiBaseQuery(),
  tagTypes: ['Subscription'],
  endpoints: (builder) => ({
    getSubscription: builder.query<Subscription | '', string>({
      query: (url) => ({
        url:
          process.env.ENV_TYPE === 'development'
            ? '/subscriptions?fake.login.mail=admin@localhost'
            : '/subscriptions',
        method: 'POST',
        data: {
          action: 'GET',
          uri: url,
        },
      }),
    }),
    getSubscriptions: builder.query<Subscriptions, void>({
      query: () => ({
        url:
          process.env.ENV_TYPE === 'development'
            ? '/user?fake.login.mail=admin@localhost'
            : '/user',
        method: 'GET',
      }),
    }),
    toggleSubscription: builder.mutation<
      Subscription,
      { action: 'DELETE' | 'ADD'; uri: string }
    >({
      query: (params) => ({
        url:
          process.env.ENV_TYPE === 'development'
            ? '/subscriptions?fake.login.mail=admin@localhost'
            : '/subscriptions',
        method: 'POST',
        data: {
          action: params.action,
          type: 'terminology',
          uri: params.uri,
        },
      }),
      invalidatesTags: ['Subscription'],
    }),
    toggleSubscriptions: builder.mutation<Subscriptions, 'DAILY' | 'DISABLED'>({
      query: (subscriptionType) => ({
        url:
          process.env.ENV_TYPE === 'development'
            ? '/user/subscriptiontype?fake.login.mail=admin@localhost'
            : '/user/subscriptiontype',
        method: 'POST',
        data: {
          subscriptionType: subscriptionType,
        },
      }),
      invalidatesTags: ['Subscription'],
    }),
  }),
});

export const {
  useGetSubscriptionQuery,
  useGetSubscriptionsQuery,
  useToggleSubscriptionMutation,
  useToggleSubscriptionsMutation,
  util: { getRunningQueriesThunk, getRunningMutationsThunk },
} = subscriptionApi;

export const { getSubscription, getSubscriptions } = subscriptionApi.endpoints;
