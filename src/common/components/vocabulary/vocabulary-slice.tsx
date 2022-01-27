import { createSlice } from '@reduxjs/toolkit';
import { createApi } from '@reduxjs/toolkit/query/react';
import { AppState, AppThunk } from '../../../store';
import { Collection } from '../../interfaces/collection.interface';
import { VocabularyConcepts, VocabularyInfoDTO } from '../../interfaces/vocabulary.interface';
import axiosBaseQuery from '../axios-base-query';

export interface VocabularyState {
  filter: {
    status: { [status: string]: boolean };
    showBy: string;
  };
  currTerminology: {
    id: string;
    value: string;
  };
  resultStart: number;
}

export const vocabularyInitialState: VocabularyState = {
  filter: {
    status: {
      'VALID': true,
      'DRAFT': true,
      'RETIRED': false,
      'SUPERSEDED': false
    },
    showBy: 'concepts'
  },
  currTerminology: {
    id: '',
    value: ''
  },
  resultStart: 0
};

export const vocabularySlice = createSlice({
  name: 'vocabularySearch',
  initialState: vocabularyInitialState,
  reducers: {
    setVocabularyFilter(state, action) {
      return {
        ...state,
        ...action.payload
      };
    },
    setCurrentTerminology(state, action) {
      return {
        ...state,
        ...action.payload
      };
    },
    setResultStart(state, action) {
      state.resultStart = action.payload;
    }
  },
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
    getConceptResult: builder.query<VocabularyConcepts, {id: string, resultStart: number, query: string, status: string[]}>({
      query: (value) => ({
        url: '/searchConcept',
        method: 'POST',
        data: {
          highlight: true,
          pageFrom: value.resultStart,
          pageSize: 10,
          query: value.query,
          sortDirection: 'ASC',
          sortLanguage: 'fi',
          status: value.status,
          terminologyId: [
            value.id
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

export const setVocabularyFilter = (filter: VocabularyState['filter']): AppThunk => dispatch => {
  dispatch(
    vocabularySlice.actions.setVocabularyFilter({
      filter: filter
    }),
  );
};

export const initializeVocabularyFilter = (): AppThunk => dispatch => {
  dispatch(
    vocabularySlice.actions.setVocabularyFilter(
      vocabularyInitialState
    )
  );
};

export const setCurrentTerminology = (currVal: VocabularyState['currTerminology']): AppThunk => dispatch => {
  dispatch(
    vocabularySlice.actions.setCurrentTerminology({
      currTerminology: currVal
    })
  );
};

export const resetVocabularyFilter = (): AppThunk => dispatch => {
  dispatch(
    vocabularySlice.actions.setVocabularyFilter({
      filter: vocabularyInitialState.filter
    })
  );
};

export const setResultStart = (resultStart: number): AppThunk => dispatch => {
  dispatch(
    vocabularySlice.actions.setResultStart(resultStart),
  );
};

export const selectVocabularyFilter = () => (state: AppState): any => state.vocabularySearch.filter;
export const selectCurrentTerminology = () => (state: AppState): any => state.vocabularySearch.currTerminology;
export const selectResultStart = () => (state: AppState): any => state.vocabularySearch.resultStart;

export default vocabularySlice.reducer;
