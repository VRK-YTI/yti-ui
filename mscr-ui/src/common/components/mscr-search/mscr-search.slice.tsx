import {createApi} from '@reduxjs/toolkit/query/react';
import {getDatamodelApiBaseQuery} from '@app/store/api-base-query';
import {HYDRATE} from 'next-redux-wrapper';
import {MscrSearchResults} from '@app/common/interfaces/mscr-search-results.interface';
import {UrlState} from '@app/common/utils/hooks/use-url-state';

// Construct url based on search params.
// Base: /frontend/
// mscrSearch                     <- Takes a _type param, only returns published
// mscrSearchPersonalContent      <- Takes a _type param
// mscrSearchOrgContent
//

function createUrl(urlState: UrlState) {
  let baseQuery = '/frontend/mscrSearch?';

  // if (urlState.domain) {
  //   if (urlState.domain == 'personal') {
  //     baseQuery = baseQuery.concat('PersonalContent?');
  //   } else if (urlState.domain == 'all') {
  //     baseQuery = baseQuery.concat('OrgContent?');
  //   }
  // } else {
  //   baseQuery = baseQuery.concat('?');
  // }

  baseQuery = baseQuery.concat(`query=${urlState.q}`);

  if (urlState.type && urlState.type.length > 0) {
    baseQuery = baseQuery.concat(`&type=${urlState.type.join(',')}`);
  }

  console.log('url to call: ', baseQuery);  // Logs on the client, not server!
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
