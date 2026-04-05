import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { UserProfile } from '../types';

interface UpdateProfileRequest {
  name?: string;
  email?: string;
}

interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/user',
    credentials: 'include',
  }),
  tagTypes: ['Profile'],
  endpoints: (builder) => ({
    getProfile: builder.query<UserProfile, void>({
      query: () => '/profile',
      providesTags: ['Profile'],
    }),

    updateProfile: builder.mutation<UserProfile, UpdateProfileRequest>({
      query: (body) => ({
        url: '/profile',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Profile'],
    }),

    changePassword: builder.mutation<string, ChangePasswordRequest>({
      query: (body) => ({
        url: '/password',
        method: 'PATCH',
        body,
        responseHandler: 'text',
      }),
    }),

    updateTheme: builder.mutation<string, { themePreference: string }>({
      query: (body) => ({
        url: '/theme',
        method: 'PATCH',
        body,
        responseHandler: 'text',
      }),
      invalidatesTags: ['Profile'],
    }),

    deleteAccount: builder.mutation<string, { password: string }>({
      query: (body) => ({
        url: '/account',
        method: 'DELETE',
        body,
        responseHandler: 'text',
      }),
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useUpdateThemeMutation,
  useDeleteAccountMutation,
} = userApi;
