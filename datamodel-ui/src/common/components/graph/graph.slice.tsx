import { AppState } from '@app/store';
import { createSlice } from '@reduxjs/toolkit';

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
});

export function selectNodes() {
  return (state: AppState) => state.graph.nodes;
}

export function selectEdges() {
  return (state: AppState) => state.graph.edges;
}
