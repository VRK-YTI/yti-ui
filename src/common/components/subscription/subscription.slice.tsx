import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '../axios-base-query';
import { HYDRATE } from 'next-redux-wrapper';
import {
  Subscription,
  Subscriptions,
} from '../../interfaces/subscription.interface';

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
    getSubscriptions: builder.query<Subscriptions, null>({
      query: () => ({
        url:
          process.env.NODE_ENV === 'development'
            ? '/user?fake.login.mail=admin@localhost'
            : '/user',
        method: 'GET',
      }),
      transformResponse: (response: Subscriptions) => {
        // Messaging-api receives data from cloud
        // and resources don't have prefLabels
        // because (presumably) subscribed uri's
        // don't have corresponding terminology available.

        if (
          process.env.NODE_ENV === 'development' &&
          response.resources.length > 0
        ) {
          const temp = Object.assign({}, response);
          temp.resources.forEach((resource) => {
            resource['prefLabel'] = { fi: 'prefLabel in dev' };
          });
          return temp;
        }
        return response;
      },
    }),
    toggleSubscription: builder.mutation<
      Subscription,
      { action: 'DELETE' | 'ADD'; uri: string }
    >({
      query: (params) => ({
        url:
          process.env.NODE_ENV === 'development'
            ? '/subscriptions?fake.login.mail=admin@localhost'
            : '/subscriptions',
        method: 'POST',
        data: {
          action: params.action,
          type: 'terminology',
          uri: params.uri,
        },
      }),
    }),
    toggleSubscriptions: builder.mutation<Subscriptions, 'DAILY' | 'DISABLED'>({
      query: (subscriptionType) => ({
        url:
          process.env.NODE_ENV === 'development'
            ? '/user/subscriptiontype?fake.login.mail=admin@localhost'
            : '/user/subscriptiontype',
        method: 'POST',
        data: {
          subscriptionType: subscriptionType,
        },
      }),
    }),
  }),
});

export const {
  useGetSubscriptionQuery,
  useGetSubscriptionsQuery,
  useToggleSubscriptionMutation,
  useToggleSubscriptionsMutation,
  util: { getRunningOperationPromises },
} = subscriptionApi;

export const { getSubscription } = subscriptionApi.endpoints;
