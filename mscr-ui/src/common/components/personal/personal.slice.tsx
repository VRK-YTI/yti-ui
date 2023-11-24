import { createApi } from '@reduxjs/toolkit/query/react';
import { getDatamodelApiBaseQuery } from '@app/store/api-base-query';
import { HYDRATE } from 'next-redux-wrapper';
import { MscrSearchResults } from '@app/common/interfaces/search.interface';

export const mscrSearchPersonalContentApi = createApi({
  reducerPath: 'mscrSearchPersonalContentApi',
  baseQuery: getDatamodelApiBaseQuery(),
  tagTypes: ['mscrSearchPersonalContentApi'],
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  endpoints: (builder) => ({
    getPersonalContent: builder.query<
      MscrSearchResults,
      string
    >({
      query: (type) => ({
        url: `/frontend/mscrSearchPersonalContent?query=&type=${type}`,
        method: 'GET',
      })
    })
  })

});

export const {
  useGetPersonalContentQuery,
  util: { getRunningQueriesThunk},
} = mscrSearchPersonalContentApi;
