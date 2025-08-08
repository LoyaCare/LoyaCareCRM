import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { NEXT_PUBLIC_API_URL } from "@/shared/config/urls";
import { User, UserExt, CreateUserDTO, UpdateUserDTO } from "./types";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: NEXT_PUBLIC_API_URL,
    credentials: "include",
  }),
  tagTypes: ["Users"],
  endpoints: (build) => ({
    getUsers: build.query<UserExt[], void>({
      query: () => "users",
      providesTags: ["Users"],
    }),
    getUserById: build.query<User, string>({
      query: (id) => `users/${id}`,
      providesTags: (_result, _err, id) => [{ type: "Users", id }],
    }),
    createUser: build.mutation<User, CreateUserDTO>({
      query: (body) => ({
        url: "users",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Users"],
    }),
    updateUser: build.mutation<User, { id: string; body: UpdateUserDTO }>({
      query: ({ id, body }) => ({
        url: `users/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _err, { id }) => [{ type: "Users", id }],
    }),
    deleteUser: build.mutation<void, string>({
      query: (id) => ({
        url: `users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;
