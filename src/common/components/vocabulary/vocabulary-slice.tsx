import { createSlice } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { AppState, AppThunk } from '../../../store';
import { VocabularyConcepts, VocabularyInfoDTO } from '../../interfaces/vocabulary.interface';

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

const vocabularyInitialState: VocabularyState = {
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

export const vocabularyEmptyState: VocabularyState = {
  filter: {
    status: {
      'VALID': false,
      'DRAFT': false,
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
  baseQuery: fetchBaseQuery({ baseUrl: '/terminology-api/api/v1/frontend' }),
  tagTypes: ['Vocabulary'],
  endpoints: builder => ({
    getConceptResult: builder.query<VocabularyConcepts, string>({
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

export const { useGetConceptResultQuery, useGetVocabularyQuery } = vocabularyApi;

export const setVocabularyFilter = (filter: VocabularyState): AppThunk => dispatch => {
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

export const setCurrentTerminology = (currVal: {id: string, value: string}): AppThunk => dispatch => {
  dispatch(
    vocabularySlice.actions.setCurrentTerminology({
      currTerminology: currVal
    })
  );
};

export const resetVocabularyFilter = (): AppThunk => dispatch => {
  dispatch(
    vocabularySlice.actions.setVocabularyFilter(
      vocabularyEmptyState
    )
  );
};

export const selectVocabularyFilter = () => (state: AppState): any => state.vocabularySearch.filter;
export const selectCurrentTerminology = () => (state: AppState): any => state.vocabularySearch.currTerminology;

export default vocabularySlice.reducer;
