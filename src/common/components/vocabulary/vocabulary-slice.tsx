import { createSlice } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const vocabularySlice = createSlice({
  name: 'vocabularySearch',
  initialState: [],
  reducers: {},
});

export const vocabularyApi = createApi({
  reducerPath: 'vocabularyAPI',
  baseQuery: fetchBaseQuery({ baseUrl: '/terminology-api/api/v1/frontend' }),
  tagTypes: ['Vocabulary'],
  endpoints: builder => ({
    getConceptResult: builder.query<any, string>({
      query: (value) => ({
        url: '/searchConcept',
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: {
          highlight: true,
          pageFrom: 0,
          pageSize: 100,
          sortDirection: 'ASC',
          sortLanguage: 'fi',
          terminologyId: [
            value
          ]
        },
      }),
    }),
    getVocabulary: builder.query<any, string>({
      query: (value) => ({
        url: `/vocabulary?graphId=${value}`,
        method: 'GET',
        headers: {
          'content-type': 'application/json',
        },
      })
    })
  }),
});

export const { useGetConceptResultQuery, useGetVocabularyQuery } = vocabularyApi;

export default vocabularySlice.reducer;
