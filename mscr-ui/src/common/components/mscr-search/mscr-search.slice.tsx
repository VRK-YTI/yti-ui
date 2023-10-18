import {createApi} from '@reduxjs/toolkit/query/react';
import {getDatamodelApiBaseQuery} from '@app/store/api-base-query';
import {HYDRATE} from 'next-redux-wrapper';
import {MscrSearchResults} from '@app/common/interfaces/mscr-search-results.interface';
import {UrlState} from "yti-common-ui/utils/hooks/use-url-state";

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

function createUrl(urlState: UrlState) {
  let baseUrl = '/frontend/mscrSearch?';
  // if (urlState.scope) {
  //   if (urlState.scope == 'personal') {
  //     baseUrl = baseUrl.concat('PersonalContent');
  //   } else {
  //     baseUrl = baseUrl.concat('OrgContent');
  //   }
  // }

  console.log('url to call: ', baseUrl);  // Logs on the client, not server!
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
