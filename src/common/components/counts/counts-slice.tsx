import { createApi } from "@reduxjs/toolkit/query/react";
import { Counts } from "../../interfaces/counts.interface";
import axiosBaseQuery from "../axios-base-query";

export const countsApi = createApi({
  reducerPath: "countsApi",
  baseQuery: axiosBaseQuery({ baseUrl: "/terminology-api/api/v1/frontend" }),
  tagTypes: ["Counts"],
  endpoints: (builder) => ({
    getCounts: builder.query<Counts, null>({
      query: () => ({
        url: "/counts",
        method: "GET",
      }),
    }),
    getVocabularyCount: builder.query<Counts, string>({
      query: (value) => ({
        url: `/conceptCounts?graphId=${value}`,
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      }),
    }),
  }),
});

export const { useGetCountsQuery, useGetVocabularyCountQuery } = countsApi;
