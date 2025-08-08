import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { NEXT_PUBLIC_API_URL } from "@/shared/config/urls";
import { Deal, DealExt, CreateDealDTO, UpdateDealDTO } from "./types";

export const dealApi = createApi({
  reducerPath: "dealApi",
  baseQuery: fetchBaseQuery({
    baseUrl: NEXT_PUBLIC_API_URL,
    credentials: "include",
  }),
  tagTypes: ["Deals"],
  endpoints: (build) => ({
    getDeals: build.query<DealExt[], void>({
      query: () => "deals",
      providesTags: ["Deals"],
    }),
    getDealById: build.query<Deal, string>({
      query: (id) => `deals/${id}`,
      providesTags: (_result, _err, id) => [{ type: "Deals", id }],
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
} = dealApi;
