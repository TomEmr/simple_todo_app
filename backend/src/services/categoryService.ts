import { AppError } from '../utils/AppError';
import { prisma } from '../utils/prisma';

const DEFAULT_CATEGORIES = [
  { name: 'Work', icon: 'work', color: '#FFF0E0', textColor: '#804200' },
  { name: 'Personal', icon: 'person', color: '#F0E8FF', textColor: '#3B0066' },
  { name: 'Shopping', icon: 'shopping_cart', color: '#E0F0FF', textColor: '#000066' },
  { name: 'Health', icon: 'favorite', color: '#E0F5E9', textColor: '#004D1A' },
];

const MAX_CATEGORIES = 20;

export async function initDefaultCategories(userId: number) {
  await prisma.category.createMany({
    data: DEFAULT_CATEGORIES.map((cat) => ({
      ...cat,
      isDefault: true,
      userId,
    })),
  });
}

export async function getCategories(userId: number) {
  const categories = await prisma.category.findMany({
    where: { userId },
    orderBy: { createdAt: 'asc' },
    include: { _count: { select: { tasks: true } } },
  });

  return categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    icon: cat.icon,
    color: cat.color,
    textColor: cat.textColor,
    isDefault: cat.isDefault,
    taskCount: cat._count.tasks,
  }));
}

export async function createCategory(
  userId: number,
  data: { name: string; icon: string; color: string; textColor: string }
) {
  const count = await prisma.category.count({ where: { userId } });
  if (count >= MAX_CATEGORIES) {
    throw new AppError(`Maximum of ${MAX_CATEGORIES} categories allowed.`, 400);
  }

  if (!data.name || !data.icon || !data.color || !data.textColor) {
    throw new AppError('Name, icon, color, and textColor are required.', 400);
  }

  const category = await prisma.category.create({
    data: { ...data, isDefault: false, userId },
    include: { _count: { select: { tasks: true } } },
  });

  return {
    id: category.id,
    name: category.name,
    icon: category.icon,
    color: category.color,
    textColor: category.textColor,
    isDefault: category.isDefault,
    taskCount: category._count.tasks,
  };
}

export async function updateCategory(
  userId: number,
  categoryId: number,
  data: { name?: string; icon?: string; color?: string; textColor?: string }
) {
  const category = await prisma.category.findFirst({
    where: { id: categoryId, userId },
  });
  if (!category) {
    throw new AppError('Category not found.', 404);
  }

  const updated = await prisma.category.update({
    where: { id: categoryId },
    data,
    include: { _count: { select: { tasks: true } } },
  });

  return {
    id: updated.id,
    name: updated.name,
    icon: updated.icon,
    color: updated.color,
    textColor: updated.textColor,
    isDefault: updated.isDefault,
    taskCount: updated._count.tasks,
  };
}

export async function deleteCategory(userId: number, categoryId: number) {
  const category = await prisma.category.findFirst({
    where: { id: categoryId, userId },
  });
  if (!category) {
    throw new AppError('Category not found.', 404);
  }

  await prisma.task.updateMany({
    where: { categoryId, userId },
    data: { categoryId: null },
  });

  await prisma.category.delete({ where: { id: categoryId } });
}
