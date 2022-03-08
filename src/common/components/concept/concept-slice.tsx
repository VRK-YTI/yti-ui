import { createApi } from '@reduxjs/toolkit/query/react';
import { Concept } from '../../interfaces/concept.interface';
import axiosBaseQuery from '../axios-base-query';

export const conceptApi = createApi({
  reducerPath: 'conceptAPI',
  baseQuery: axiosBaseQuery({ baseUrl: '/terminology-api/api/v1/frontend' }),
  tagTypes: ['Concept'],
  endpoints: (builder) => ({
    getConcept: builder.query<
      Concept,
      { terminologyId: string; conceptId: string }
    >({
      query: ({ terminologyId, conceptId }) => ({
        url: `/concept?graphId=${terminologyId}&conceptId=${conceptId}`,
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetConceptQuery } = conceptApi;
