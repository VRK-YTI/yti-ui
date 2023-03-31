import { convertToNodes } from '@app/modules/graph/utils';
import { AppState, AppThunk } from '@app/store';
import isHydrate from '@app/store/isHydrate';
import { createSlice } from '@reduxjs/toolkit';
import { searchInternalResourcesApi } from '../search-internal-resources/search-internal-resources.slice';

const initialGraph = {
  nodes: [],
  edges: [],
};

export const graphSlice = createSlice({
  name: 'graph',
  initialState: initialGraph,
  reducers: {
    setNodes(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    setEdges(state, action) {
      return {
        ...state,
        edges: action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      searchInternalResourcesApi.endpoints.queryInternalResources
        .matchFulfilled,
      (state, action) => {
        if (action.meta.arg.originalArgs.resourceTypes[0] === 'CLASS') {
          return {
            nodes: convertToNodes(action.payload),
            edges: [],
          };
        }
      }
    );
    builder.addMatcher(isHydrate, (_, action) => {
      return action.payload.graph;
    });
  },
});

export function selectNodes() {
  return (state: AppState) => state.graph.nodes;
}

export function selectEdges() {
  return (state: AppState) => state.graph.edges;
}
