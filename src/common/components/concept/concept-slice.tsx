import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Concept } from '../../interfaces/concept.interface';

export const conceptApi = createApi({
  reducerPath: 'conceptAPI',
  baseQuery: fetchBaseQuery({ baseUrl: '/terminology-api/api/v1/frontend' }),
  tagTypes: ['Concept'],
  endpoints: builder => ({
    getConcept: builder.query<Concept, { terminologyId: string, conceptId: string }>({
      query: ({ terminologyId, conceptId }) => ({
        url: `/concept?graphId=${terminologyId}&conceptId=${conceptId}`,
        method: 'GET',
        headers: {
          'content-type': 'application/json',
        },
      })
    })
  }),
});

export const { useGetConceptQuery } = conceptApi;
