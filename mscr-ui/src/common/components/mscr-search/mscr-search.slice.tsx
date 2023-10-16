import {createApi} from '@reduxjs/toolkit/query/react';
import {getDatamodelApiBaseQuery} from '@app/store/api-base-query';
import {HYDRATE} from 'next-redux-wrapper';
import {MscrSearchResults} from '@app/common/interfaces/mscr-search-results.interface';

// Construct url based on search params.
// Base: /frontend/
// mscrSearch                     <- Takes a _type param
// mscrSearchPersonalContent      <- Takes a _type param
// mscrSearchOrgContent
//

export interface MscrSearchParams {
  query: string;
  type?: string;
  scope?: string;
}

function createUrl(obj: MscrSearchParams) {
  let baseUrl = '/frontend/mscrSearch';
  if (obj.scope) {
    if (obj.scope == 'personal') {
      baseUrl = baseUrl.concat('PersonalContent');
    } else {
      baseUrl = baseUrl.concat('OrgContent');
    }
  }
  console.log('url to call: ', baseUrl);  // Logs on the client, not server!
  console.log('object: ', obj);
  return baseUrl;
}

export const mscrSearchApi = createApi({
  reducerPath: 'mscrSearchApi',
  baseQuery: getDatamodelApiBaseQuery(),
  tagTypes: ['mscrSearch'],
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  endpoints: (builder) => ({
    getMscrSearchResults: builder.query<
      MscrSearchResults,
      MscrSearchParams
    >({
      query: (object) => ({
        url: createUrl(object),
        method: 'GET',
        type: object.type ?? null,
      })
    })
  })

});

export const { getMscrSearchResults } = mscrSearchApi.endpoints;

export const {
  useGetMscrSearchResultsQuery,
  util: { getRunningQueriesThunk},
} = mscrSearchApi;
