import {createApi} from '@reduxjs/toolkit/query/react';
import {getDatamodelApiBaseQuery} from '@app/store/api-base-query';
import {HYDRATE} from 'next-redux-wrapper';
import {MscrSearchResults} from '@app/common/interfaces/search.interface';
import {UrlState} from '@app/common/utils/hooks/use-url-state';

// Construct url based on search params.
// Base: /frontend/
// mscrSearch                     <- Takes a _type param, only returns published
// mscrSearchPersonalContent      <- Takes a _type param
// mscrSearchOrgContent
//

function createUrl(urlState: UrlState) {
  let baseQuery = '/frontend/mscrSearch?';

  // Not clear what the logic for using Personal or Org endpoints will be

  baseQuery = baseQuery.concat(`query=${urlState.q}`);

  if (urlState.type && urlState.type.length > 0) {
    baseQuery = baseQuery.concat(`&type=${urlState.type.join(',')}`);
  }
  if (urlState.state && urlState.state.length > 0) {
    baseQuery = baseQuery.concat(`&state=${urlState.state.join(',')}`);
  }
  if (urlState.format && urlState.format.length > 0) {
    baseQuery = baseQuery.concat(`&format=${urlState.format.join(',')}`);
  }
  if (urlState.sourceType && urlState.sourceType.length > 0) {
    baseQuery = baseQuery.concat(`&sourceType=${urlState.sourceType.join(',')}`);
  }
  if (urlState.organization && urlState.organization.length > 0) {
    baseQuery = baseQuery.concat(`&organization=${urlState.organization.join(',')}`);
  }

  console.log('url to call (mscr-search.slice): ', baseQuery);  // Logs on the client, not server!
  return baseQuery;
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
      UrlState
    >({
      query: (urlState) => ({
        url: createUrl(urlState),
        method: 'GET',
      })
    })
  })

});

export const { getMscrSearchResults } = mscrSearchApi.endpoints;

export const {
  useGetMscrSearchResultsQuery,
  util: { getRunningQueriesThunk},
} = mscrSearchApi;
