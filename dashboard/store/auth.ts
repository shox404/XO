import type { User } from "@/lib/types/auth";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { toast } from "sonner";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/auth",
    credentials: "include",
  }),
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    checkAuth: builder.query<User, void>({
      query: () => "/me",
      providesTags: ["Auth"],
    }),

    requestCode: builder.mutation<void, { email: string }>({
      query: (body) => ({
        url: "/request-code",
        method: "POST",
        body,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Code sent! Check your email.");
        } catch (err: any) {
          toast.error(
            err?.error?.data?.error || "Failed to send code"
          );
        }
      },
    }),

    verifyCode: builder.mutation<User, { email: string; code: string }>({
      query: (body) => ({
        url: "/verify-code",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Logged in successfully!");
        } catch (err: any) {
          toast.error(
            err?.error?.data?.error || "Invalid code"
          );
        }
      },
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          toast.success("Logged out");
        }
      },
    }),
  }),
});

export const {
  useCheckAuthQuery,
  useRequestCodeMutation,
  useVerifyCodeMutation,
  useLogoutMutation,
} = authApi;
