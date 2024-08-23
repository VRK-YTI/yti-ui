import { createSlice } from '@reduxjs/toolkit';
import { createApi } from '@reduxjs/toolkit/query/react';
import { Collection } from '@app/common/interfaces/collection.interface';
import {
  VocabulariesDTO,
  VocabularyCopyInfo,
} from '@app/common/interfaces/vocabulary.interface';
import { UrlState } from '@app/common/utils/hooks/use-url-state';
import { getTerminologyApiBaseQuery } from '@app/store/api-base-query';
import {
  ConceptResponseObject,
  SearchResponse,
  Terminology,
} from '@app/common/interfaces/interfaces-v2';

export const vocabularyInitialState = {};

export const vocabularySlice = createSlice({
  name: 'vocabularySearch',
  initialState: vocabularyInitialState,
  reducers: {},
});

export const terminologyApi = createApi({
  reducerPath: 'terminologyApi',
  baseQuery: getTerminologyApiBaseQuery(),
  tagTypes: ['Terminology'],
  endpoints: (builder) => ({
    getCollections: builder.query<Collection[], string>({
      query: (terminologyId) => ({
        url: `/collections?graphId=${terminologyId}`,
        method: 'GET',
      }),
    }),
    getConceptResult: builder.query<
      SearchResponse<ConceptResponseObject>,
      { urlState: UrlState; id: string; language: string }
    >({
      query: (value) => ({
        url: '/frontend/search-concepts',
        method: 'GET',
        params: {
          highlight: true,
          pageFrom: Math.max(0, (value.urlState.page - 1) * 50),
          pageSize: 50,
          query: value.urlState.q,
          sortDirection: 'ASC',
          sortLanguage: value.urlState.lang
            ? value.urlState.lang
            : value.language
            ? value.language
            : 'fi',
          status: value.urlState.status.map((s) => s.toUpperCase()),
          namespace: `https://iri.suomi.fi/terminology/${value.id}/`,
        },
      }),
    }),
    getTerminology: builder.query<Terminology, { id: string }>({
      query: (value) => ({
        url: `/terminology/${value.id}`,
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
    deleteVocabulary: builder.mutation<null, string>({
      query: (uuid) => ({
        url: `/vocabulary?graphId=${uuid}`,
        method: 'DELETE',
      }),
    }),
    getIfNamespaceInUse: builder.mutation<boolean, string>({
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
  useGetTerminologyQuery,
  usePostNewVocabularyMutation,
  usePostCreateVersionMutation,
  useDeleteVocabularyMutation,
  useGetIfNamespaceInUseMutation,
  useGetVocabulariesQuery,
  util: { getRunningQueriesThunk },
} = terminologyApi;

export default vocabularySlice.reducer;

export const { getTerminology, getCollections, getConceptResult } =
  terminologyApi.endpoints;
