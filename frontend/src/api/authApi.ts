import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { LoginFormData, RegisterFormData, LoginResponse, UserProfile } from '../types';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/auth',
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    register: builder.mutation<LoginResponse, RegisterFormData>({
      query: (body) => ({
        url: '/register',
        method: 'POST',
        body,
      }),
    }),

    login: builder.mutation<LoginResponse, LoginFormData>({
      query: (body) => ({
        url: '/login',
        method: 'POST',
        body,
      }),
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/logout',
        method: 'GET',
      }),
    }),

    getMe: builder.query<UserProfile, void>({
      query: () => '/me',
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
} = authApi;
