import { createSlice } from '@reduxjs/toolkit';
import { createApi } from '@reduxjs/toolkit/query/react';
import { Collection } from '@app/common/interfaces/collection.interface';
import {
  VocabularyConcepts,
  VocabularyInfoDTO,
} from '@app/common/interfaces/vocabulary.interface';
import { UrlState } from '@app/common/utils/hooks/useUrlState';
import axiosBaseQuery from '@app/common/components/axios-base-query';
import { HYDRATE } from 'next-redux-wrapper';

export const vocabularyInitialState = {};

export const vocabularySlice = createSlice({
  name: 'vocabularySearch',
  initialState: vocabularyInitialState,
  reducers: {},
});

export const vocabularyApi = createApi({
  reducerPath: 'vocabularyAPI',
  baseQuery: axiosBaseQuery({
    baseUrl: process.env.TERMINOLOGY_API_URL
      ? `${process.env.TERMINOLOGY_API_URL}/api/v1/frontend`
      : '/terminology-api/api/v1/frontend',
  }),
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  tagTypes: ['Vocabulary'],
  endpoints: (builder) => ({
    getCollections: builder.query<Collection[], string>({
      query: (terminologyId) => ({
        url: `/collections?graphId=${terminologyId}`,
        method: 'GET',
      }),
    }),
    getConceptResult: builder.query<
      VocabularyConcepts,
      { urlState: UrlState; id: string }
    >({
      query: (value) => ({
        url: '/searchConcept',
        method: 'POST',
        data: {
          highlight: true,
          pageFrom: Math.max(0, (value.urlState.page - 1) * 10),
          pageSize: 10,
          query: value.urlState.q,
          sortDirection: 'ASC',
          sortLanguage: 'fi',
          status: value.urlState.status.map((s) => s.toUpperCase()),
          terminologyId: [value.id],
        },
      }),
    }),
    getVocabulary: builder.query<VocabularyInfoDTO, string>({
      query: (value) => ({
        url: `/vocabulary?graphId=${value}`,
        method: 'GET',
        headers: {
          'content-type': 'application/json',
        },
      }),
    }),
  }),
});

export const {
  useGetCollectionsQuery,
  useGetConceptResultQuery,
  useGetVocabularyQuery,
  util: { getRunningOperationPromises },
} = vocabularyApi;

export default vocabularySlice.reducer;

export const { getVocabulary, getCollections, getConceptResult } =
  vocabularyApi.endpoints;
