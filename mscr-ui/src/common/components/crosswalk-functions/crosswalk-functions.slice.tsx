import { createApi } from '@reduxjs/toolkit/query/react';
import { getDatamodelApiBaseQuery } from '@app/store/api-base-query';
import { HYDRATE } from 'next-redux-wrapper';
import { MscrSearchResults } from '@app/common/interfaces/search.interface';

export const crosswalkMappingFunctionsApi = createApi({
    reducerPath: 'crosswalkMappingFunctionsApi',
    baseQuery: getDatamodelApiBaseQuery(),
    tagTypes: ['crosswalkMappingFunctionsApi'],
    extractRehydrationInfo(action, { reducerPath }) {
        if (action.type === HYDRATE) {
            return action.payload[reducerPath];
        }
    },
    endpoints: (builder) => ({
        getCrosswalkMappingFunctions: builder.query<any, string>({
            query: (type) => ({
                url: type === 'FILTERS' ? '/frontend/filters' : '/frontend/functions',
                method: 'GET',
            }),
        }),
    }),
});

export const {
    useGetCrosswalkMappingFunctionsQuery,
    util: { getRunningQueriesThunk },
} = crosswalkMappingFunctionsApi;
