export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt?: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  userName: string;
  password: string;
  email: string;
}

export interface LoginResponse {
  userName: string;
}

export type FilterKey = 'all' | 'active' | 'completed';

export interface FilterOption {
  key: FilterKey;
  label: string;
}
