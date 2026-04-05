export interface Task {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  position: number;
  dueDate: string | null;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | null;
  categoryId: number | null;
  categoryName: string | null;
  categoryColor: string | null;
  categoryTextColor: string | null;
  completedAt: string | null;
  createdAt: string;
}

export interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
  textColor: string;
  isDefault: boolean;
  taskCount: number;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  themePreference: string;
  createdAt: string;
  stats: {
    completed: number;
    active: number;
    categories: number;
  };
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  dueDate?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  categoryId?: number;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string | null;
  dueDate?: string | null;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | null;
  categoryId?: number | null;
  completed?: boolean;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  name: string;
  email: string;
  themePreference: string;
}

export type FilterKey = 'all' | 'active' | 'completed';
