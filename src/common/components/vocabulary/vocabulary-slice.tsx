import { createSlice } from '@reduxjs/toolkit';
import { createApi } from '@reduxjs/toolkit/query/react';
import { Collection } from '../../interfaces/collection.interface';
import { VocabularyConcepts, VocabularyInfoDTO } from '../../interfaces/vocabulary.interface';
import axiosBaseQuery from '../axios-base-query';

export interface VocabularyState {}

export const vocabularyInitialState: VocabularyState = {};

export const vocabularySlice = createSlice({
  name: 'vocabularySearch',
  initialState: vocabularyInitialState,
  reducers: {},
});

export const vocabularyApi = createApi({
  reducerPath: 'vocabularyAPI',
  baseQuery: axiosBaseQuery({ baseUrl: '/terminology-api/api/v1/frontend' }),
  tagTypes: ['Vocabulary'],
  endpoints: builder => ({
    getCollections: builder.query<Collection[], string>({
      query: (terminologyId) => ({
        url: `/collections?graphId=${terminologyId}`,
        method: 'GET'
      })
    }),
    getConceptResult: builder.query<VocabularyConcepts, string>({
      query: (value) => ({
        url: '/searchConcept',
        method: 'POST',
        data: {
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
    getVocabulary: builder.query<VocabularyInfoDTO, string>({
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

export const {
  useGetCollectionsQuery,
  useGetConceptResultQuery,
  useGetVocabularyQuery
} = vocabularyApi;

export default vocabularySlice.reducer;
