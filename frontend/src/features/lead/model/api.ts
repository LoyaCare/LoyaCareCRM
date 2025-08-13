import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BACKEND_API_URL } from "@/shared/config/urls";
import { Lead, LeadExt, CreateLeadDTO, UpdateLeadDTO } from "@/features/lead/model/types";

export const leadApiReducerPath = "leadApi";

export const leadApi = createApi({
  reducerPath: "leadApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BACKEND_API_URL,
    credentials: "include",
  }),
  tagTypes: ["Leads"],
  endpoints: (build) => ({
    getLeads: build.query<LeadExt[], void>({
      query: () => "leads",
      providesTags: ["Leads"],
    }),
    getLeadById: build.query<LeadExt, string>({
      query: (id) => `leads/${id}`,
      providesTags: (_result, _err, id) => [{ type: "Leads", id }],
    }),
    createLead: build.mutation<Lead, CreateLeadDTO>({
      query: (body) => ({
        url: "leads",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Leads"],
    }),
    updateLead: build.mutation<Lead, { id: string; body: UpdateLeadDTO }>({
      query: ({ id, body }) => ({
        url: `leads/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _err, { id }) => [{ type: "Leads", id }],
    }),
    deleteLead: build.mutation<void, string>({
      query: (id) => ({
        url: `leads/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Leads"],
    }),
  }),
});

export const {
  useGetLeadsQuery,
  useGetLeadByIdQuery,
  useCreateLeadMutation,
  useUpdateLeadMutation,
  useDeleteLeadMutation,
} = leadApi;
