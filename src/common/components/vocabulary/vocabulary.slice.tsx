import { createSlice } from '@reduxjs/toolkit';
import { createApi } from '@reduxjs/toolkit/query/react';
import { Collection } from '@app/common/interfaces/collection.interface';
import {
  VocabulariesDTO,
  VocabularyConcepts,
  VocabularyCopyInfo,
  VocabularyInfoDTO,
} from '@app/common/interfaces/vocabulary.interface';
import { UrlState } from '@app/common/utils/hooks/useUrlState';
import { getTerminologyApiBaseQuery } from '@app/store/api-base-query';
import { HYDRATE } from 'next-redux-wrapper';

export const vocabularyInitialState = {};

export const vocabularySlice = createSlice({
  name: 'vocabularySearch',
  initialState: vocabularyInitialState,
  reducers: {},
});

export const vocabularyApi = createApi({
  reducerPath: 'vocabularyAPI',
  baseQuery: getTerminologyApiBaseQuery(),
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
      { urlState: UrlState; id: string; language: string }
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
          sortLanguage: value.urlState.lang
            ? value.urlState.lang
            : value.language
            ? value.language
            : 'fi',
          status: value.urlState.status.map((s) => s.toUpperCase()),
          terminologyId: [value.id],
        },
      }),
    }),
    getVocabulary: builder.query<VocabularyInfoDTO, { id: string }>({
      query: (value) => ({
        url: `/vocabulary?graphId=${value.id}`,
        method: 'GET',
      }),
    }),
    postNewVocabulary: builder.mutation<
      string,
      { templateGraphID: string; prefix: string; newTerminology: object }
    >({
      query: ({ templateGraphID, prefix, newTerminology }) => ({
        url: `/validatedVocabulary?templateGraphId=${templateGraphID}&prefix=${prefix}`,
        method: 'POST',
        data: newTerminology,
      }),
    }),
    postCreateVersion: builder.mutation<
      VocabularyCopyInfo,
      { graphId: string; newCode: string }
    >({
      query: ({ graphId, newCode }) => ({
        url: '/createVersion',
        method: 'POST',
        data: {
          graphId: graphId,
          newCode: newCode,
        },
      }),
    }),
    // Note! This can added to use at any point
    // deleteVocabulary: builder.mutation<any, any>({
    //   query: (uuid) => ({
    //     url: `/vocabulary?graphId=${uuid}`,
    //     method: 'DELETE',
    //   }),
    // }),
    getIfNamespaceInUse: builder.query<boolean, string>({
      query: (prefix) => ({
        url: `/namespaceInUse?prefix=${prefix}`,
        method: 'GET',
      }),
    }),
    getVocabularies: builder.query<VocabulariesDTO[], null>({
      query: () => ({
        url: '/vocabularies',
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useGetCollectionsQuery,
  useGetConceptResultQuery,
  useGetVocabularyQuery,
  usePostNewVocabularyMutation,
  usePostCreateVersionMutation,
  // useDeleteVocabularyMutation,
  useGetIfNamespaceInUseQuery,
  useGetVocabulariesQuery,
  util: { getRunningOperationPromises },
} = vocabularyApi;

export default vocabularySlice.reducer;

export const { getVocabulary, getCollections, getConceptResult } =
  vocabularyApi.endpoints;
