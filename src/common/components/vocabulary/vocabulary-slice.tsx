import { createSlice } from '@reduxjs/toolkit';
import { createApi } from '@reduxjs/toolkit/query/react';
import { AppState, AppThunk } from '../../../store';
import { Collection } from '../../interfaces/collection.interface';
import { VocabularyConcepts, VocabularyInfoDTO } from '../../interfaces/vocabulary.interface';
import axiosBaseQuery from '../axios-base-query';

export interface VocabularyState {
  filter: {
    status: { [status: string]: boolean };
    keyword: string;
    showBy: string;
  };
  currTerminology: {
    id: string;
    value: string;
  };
}

export const vocabularyInitialState: VocabularyState = {
  filter: {
    status: {
      'VALID': true,
      'DRAFT': true,
      'RETIRED': false,
      'SUPERSEDED': false
    },
    keyword: '',
    showBy: 'concepts'
  },
  currTerminology: {
    id: '',
    value: ''
  }
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

export const selectVocabularyFilter = () => (state: AppState): any => state.vocabularySearch.filter;
export const selectCurrentTerminology = () => (state: AppState): any => state.vocabularySearch.currTerminology;

export default vocabularySlice.reducer;
