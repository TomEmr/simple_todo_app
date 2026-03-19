import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Todo, FilterKey } from '../types';

export const todoApi = createApi({
  reducerPath: 'todoApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_TASK_URL,
    credentials: 'include',
  }),
  tagTypes: ['Todo'],
  endpoints: (builder) => ({
    getTodos: builder.query<Todo[], FilterKey>({
      query: (filter) => ({
        url: '',
        params: filter !== 'all' ? { status: filter } : undefined,
      }),
      providesTags: ['Todo'],
    }),
    createTodo: builder.mutation<Todo, { title: string }>({
      query: (body) => ({
        url: '',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Todo'],
    }),
    updateTodoTitle: builder.mutation<Todo, { id: number; title: string }>({
      query: ({ id, title }) => ({
        url: `/${id}/title`,
        method: 'PATCH',
        body: { title },
      }),
      invalidatesTags: ['Todo'],
    }),
    toggleTodoCompleted: builder.mutation<Todo, number>({
      query: (id) => ({
        url: `/${id}/completed`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Todo'],
    }),
    deleteTodo: builder.mutation<string, number>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
        responseHandler: 'text',
      }),
      invalidatesTags: ['Todo'],
    }),
    deleteAllCompleted: builder.mutation<string, void>({
      query: () => ({
        url: '',
        method: 'DELETE',
        responseHandler: 'text',
      }),
      invalidatesTags: ['Todo'],
    }),
    reorderTodos: builder.mutation<string, number[]>({
      query: (taskIds) => ({
        url: '/reorder',
        method: 'PUT',
        body: taskIds,
        responseHandler: 'text',
      }),
      invalidatesTags: ['Todo'],
    }),
  }),
});

export const {
  useGetTodosQuery,
  useCreateTodoMutation,
  useUpdateTodoTitleMutation,
  useToggleTodoCompletedMutation,
  useDeleteTodoMutation,
  useDeleteAllCompletedMutation,
  useReorderTodosMutation,
} = todoApi;
