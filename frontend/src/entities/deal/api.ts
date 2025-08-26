import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BACKEND_API_URL } from "@/shared/config/urls";
import { Deal, DealExt, CreateDealDTO, UpdateDealDTO, DealStatus } from "@/entities/deal/model/types";
import { DealStage } from "@/shared/generated/prisma-client/wasm";

export const dealApi = createApi({
  reducerPath: "dealApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BACKEND_API_URL,
    credentials: "include",
  }),
  tagTypes: ["Deals", "Deal"],
  // Reduce cache time to ensure fresh data but avoid excessive requests
  keepUnusedDataFor: 30, // 30 seconds
  endpoints: (build) => ({
    getDeals: build.query<DealExt[], { statuses?: DealStatus[], excludeStatuses?: DealStatus[], stages?: DealStage[], excludeStages?: DealStage[] } | undefined | null>({
      query: (params) => ({
        url: "deals",
        params: params || undefined,
      }),
      providesTags: ["Deals"],
    }),
    getDealById: build.query<DealExt, string>({
      query: (id) => `deals/${id}`,
      providesTags: (_result, _err, id) => [{ type: "Deal", id }],
    }),
    createDeal: build.mutation<Deal, CreateDealDTO>({
      query: (body) => ({
        url: "deals",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Deals"],
    }),
    updateDeal: build.mutation<Deal, { id: string; body: UpdateDealDTO }>({
      query: ({ id, body }) => ({
        url: `deals/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _err, { id }) => [{ type: "Deals", id }],
    }),
    deleteDeal: build.mutation<void, string>({
      query: (id) => ({
        url: `deals/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Deals"],
    }),
  }),
});

export const {
  useGetDealsQuery,
  useGetDealByIdQuery,
  useCreateDealMutation,
  useUpdateDealMutation,
  useDeleteDealMutation,
  useLazyGetDealByIdQuery,
} = dealApi;
