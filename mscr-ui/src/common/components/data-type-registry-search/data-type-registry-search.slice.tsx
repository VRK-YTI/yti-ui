import { DataType } from '@app/common/interfaces/data-type.interface';
import { createSlice } from '@reduxjs/toolkit';
import { AppState, AppThunk } from '@app/store';

const initialState = {
  query: '',
  hitCount: 0,
  results: new Array<DataType>,
  page: 1,
  pageSize: 5,
};

export const dataTypeSlice = createSlice({
  name: 'dataType',
  initialState: initialState,
  reducers: {
    setQuery(state, action) {
      return {
        ...state,
        query: action.payload.query,
      };
    },
    setHitCount(state, action) {
      return {
        ...state,
        hitCount: action.payload.hitCount,
      };
    },
    setResults(state, action) {
      return {
        ...state,
        results: action.payload.results,
      };
    },
    setPage(state, action) {
      return {
        ...state,
        page: action.payload.page,
      };
    },
    setPageSize(state, action) {
      return {
        ...state,
        pageSize: action.payload.pageSize,
      };
    },
  },
});

export function selectQuery() {
  return (state: AppState) => state.dataType.query;
}

export function setQuery(query: string): AppThunk {
  return (dispatch) => dispatch(dataTypeSlice.actions.setQuery({ query }));
}

export function selectHitCount() {
  return (state: AppState) => state.dataType.hitCount;
}

export function setHitCount(hitCount: number): AppThunk {
  return (dispatch) => dispatch(dataTypeSlice.actions.setHitCount({ hitCount }));
}

export function selectResults() {
  return (state: AppState) => state.dataType.results;
}

export function setResults(results: DataType[]): AppThunk {
  return (dispatch) => dispatch(dataTypeSlice.actions.setResults({ results }));
}

export function selectPage() {
  return (state: AppState) => state.dataType.page;
}

export function setPage(page: number): AppThunk {
  return (dispatch) => dispatch(dataTypeSlice.actions.setPage({ page }));
}

export function selectPageSize() {
  return (state: AppState) => state.dataType.pageSize;
}

export function setPageSize(pageSize: number): AppThunk {
  return (dispatch) => dispatch(dataTypeSlice.actions.setPageSize({ pageSize }));
}
