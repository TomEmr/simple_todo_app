import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Task, CreateTaskRequest, UpdateTaskRequest } from '../types';

interface GetTasksParams {
  status?: string;
  categoryId?: number;
  dueDate?: string;
}

export const todoApi = createApi({
  reducerPath: 'todoApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/tasks',
    credentials: 'include',
  }),
  tagTypes: ['Task', 'Category'],
  endpoints: (builder) => ({
    getTasks: builder.query<Task[], GetTasksParams | void>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params?.status) searchParams.set('status', params.status);
        if (params?.categoryId != null)
          searchParams.set('categoryId', String(params.categoryId));
        if (params?.dueDate) searchParams.set('dueDate', params.dueDate);

        const queryString = searchParams.toString();
        return queryString ? `?${queryString}` : '';
      },
      providesTags: ['Task'],
    }),

    createTask: builder.mutation<Task, CreateTaskRequest>({
      query: (body) => ({
        url: '/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Task', 'Category'],
    }),

    updateTask: builder.mutation<Task, { id: number } & UpdateTaskRequest>({
      query: ({ id, ...body }) => ({
        url: `/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Task', 'Category'],
    }),

    deleteTask: builder.mutation<string, number>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
        responseHandler: 'text',
      }),
      invalidatesTags: ['Task', 'Category'],
    }),

    deleteAllCompleted: builder.mutation<string, void>({
      query: () => ({
        url: '/',
        method: 'DELETE',
        responseHandler: 'text',
      }),
      invalidatesTags: ['Task', 'Category'],
    }),

    reorderTasks: builder.mutation<string, number[]>({
      query: (body) => ({
        url: '/reorder',
        method: 'PUT',
        body,
        responseHandler: 'text',
      }),
      invalidatesTags: ['Task'],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useLazyGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useDeleteAllCompletedMutation,
  useReorderTasksMutation,
} = todoApi;
