import { Priority } from '@prisma/client';
import { AppError } from '../utils/AppError';
import { prisma } from '../utils/prisma';

interface CreateTaskData {
  title: string;
  description?: string;
  dueDate?: string;
  priority?: string;
  categoryId?: number;
}

interface UpdateTaskData {
  title?: string;
  description?: string | null;
  dueDate?: string | null;
  priority?: string | null;
  categoryId?: number | null;
  completed?: boolean;
}

function formatTask(task: any) {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    completed: task.completed,
    position: task.position,
    dueDate: task.dueDate ? task.dueDate.toISOString().split('T')[0] : null,
    priority: task.priority,
    categoryId: task.category?.id ?? task.categoryId,
    categoryName: task.category?.name ?? null,
    categoryColor: task.category?.color ?? null,
    categoryTextColor: task.category?.textColor ?? null,
    completedAt: task.completedAt?.toISOString() ?? null,
    createdAt: task.createdAt.toISOString(),
  };
}

const taskInclude = { category: true };

export async function createTask(userId: number, data: CreateTaskData) {
  if (!data.title || data.title.trim().length === 0) {
    throw new AppError('Title is required.', 400);
  }
  if (data.title.length > 100) {
    throw new AppError('Title must be 100 characters or less.', 400);
  }

  if (data.categoryId) {
    const category = await prisma.category.findFirst({
      where: { id: data.categoryId, userId },
    });
    if (!category) {
      throw new AppError('Category not found.', 404);
    }
  }

  const maxPos = await prisma.task.aggregate({
    where: { userId },
    _max: { position: true },
  });

  const task = await prisma.task.create({
    data: {
      title: data.title.trim(),
      description: data.description?.trim() || null,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      priority: data.priority ? (data.priority as Priority) : null,
      categoryId: data.categoryId || null,
      position: (maxPos._max.position ?? 0) + 1,
      userId,
    },
    include: taskInclude,
  });

  return formatTask(task);
}

export async function getTasks(
  userId: number,
  filters: { status?: string; categoryId?: number; dueDate?: string }
) {
  const where: any = { userId };

  if (filters.status === 'active') {
    where.completed = false;
  } else if (filters.status === 'completed') {
    where.completed = true;
  }

  if (filters.categoryId) {
    where.categoryId = filters.categoryId;
  }

  if (filters.dueDate === 'today') {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    where.dueDate = { gte: today, lt: tomorrow };
  }

  const tasks = await prisma.task.findMany({
    where,
    orderBy: { position: 'asc' },
    include: taskInclude,
  });

  return tasks.map(formatTask);
}

export async function updateTask(userId: number, taskId: number, data: UpdateTaskData) {
  const task = await prisma.task.findFirst({
    where: { id: taskId, userId },
  });
  if (!task) {
    throw new AppError('Task not found.', 404);
  }

  const updateData: any = {};

  if (data.title !== undefined) {
    if (!data.title || data.title.trim().length === 0) {
      throw new AppError('Title cannot be empty.', 400);
    }
    if (data.title.length > 100) {
      throw new AppError('Title must be 100 characters or less.', 400);
    }
    updateData.title = data.title.trim();
  }

  if (data.description !== undefined) {
    updateData.description = data.description?.trim() || null;
  }

  if (data.dueDate !== undefined) {
    updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;
  }

  if (data.priority !== undefined) {
    updateData.priority = data.priority ? (data.priority as Priority) : null;
  }

  if (data.categoryId !== undefined) {
    if (data.categoryId) {
      const category = await prisma.category.findFirst({
        where: { id: data.categoryId, userId },
      });
      if (!category) {
        throw new AppError('Category not found.', 404);
      }
    }
    updateData.categoryId = data.categoryId || null;
  }

  if (data.completed !== undefined) {
    updateData.completed = data.completed;
    updateData.completedAt = data.completed ? new Date() : null;
  }

  const updated = await prisma.task.update({
    where: { id: taskId },
    data: updateData,
    include: taskInclude,
  });

  return formatTask(updated);
}

export async function deleteTask(userId: number, taskId: number) {
  const task = await prisma.task.findFirst({
    where: { id: taskId, userId },
  });
  if (!task) {
    throw new AppError('Task not found.', 404);
  }
  await prisma.task.delete({ where: { id: taskId } });
}

export async function deleteAllCompleted(userId: number) {
  const result = await prisma.task.deleteMany({
    where: { userId, completed: true },
  });
  if (result.count === 0) {
    throw new AppError('No completed tasks to delete.', 400);
  }
}

export async function reorderTasks(userId: number, taskIds: number[]) {
  for (let i = 0; i < taskIds.length; i++) {
    await prisma.task.updateMany({
      where: { id: taskIds[i], userId },
      data: { position: i + 1 },
    });
  }
}
