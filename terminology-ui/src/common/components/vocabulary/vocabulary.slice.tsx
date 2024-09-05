import { createSlice } from '@reduxjs/toolkit';
import { createApi } from '@reduxjs/toolkit/query/react';
import { VocabularyCopyInfo } from '@app/common/interfaces/vocabulary.interface';
import { UrlState } from '@app/common/utils/hooks/use-url-state';
import { getTerminologyApiBaseQuery } from '@app/store/api-base-query';
import {
  ConceptCollectionInfo,
  ConceptResponseObject,
  SearchResponse,
  Terminology,
  TerminologyInfo,
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
    getCollections: builder.query<ConceptCollectionInfo[], string>({
      query: (terminologyId) => ({
        url: `/collection/${terminologyId}`,
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
    getTerminology: builder.query<TerminologyInfo, { id: string }>({
      query: (value) => ({
        url: `/terminology/${value.id}`,
        method: 'GET',
      }),
    }),
    createTerminology: builder.mutation<string, Terminology>({
      query: (data) => ({
        url: '/terminology',
        method: 'POST',
        data,
      }),
    }),
    updateTerminology: builder.mutation<
      null,
      {
        prefix: string;
        payload: Terminology;
      }
    >({
      query: (data) => ({
        url: `/terminology/${data.prefix}`,
        method: 'PUT',
        data: data.payload,
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
    deleteTerminology: builder.mutation<null, string>({
      query: (prefix) => ({
        url: `/terminology/${prefix}`,
        method: 'DELETE',
      }),
    }),
    getIfNamespaceInUse: builder.mutation<boolean, string>({
      query: (prefix) => ({
        url: `/terminology/${prefix}/exists`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useGetCollectionsQuery,
  useGetConceptResultQuery,
  useGetTerminologyQuery,
  useCreateTerminologyMutation,
  useUpdateTerminologyMutation,
  usePostCreateVersionMutation,
  useDeleteTerminologyMutation,
  useGetIfNamespaceInUseMutation,
  util: { getRunningQueriesThunk },
} = terminologyApi;

export default vocabularySlice.reducer;

export const { getTerminology, getCollections, getConceptResult } =
  terminologyApi.endpoints;
