import bcrypt from 'bcryptjs';
import { AppError } from '../utils/AppError';
import { prisma } from '../utils/prisma';

export async function getProfile(userId: number) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError('User not found.', 404);
  }

  const [completedCount, activeCount, categoryCount] = await Promise.all([
    prisma.task.count({ where: { userId, completed: true } }),
    prisma.task.count({ where: { userId, completed: false } }),
    prisma.category.count({ where: { userId } }),
  ]);

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    themePreference: user.themePreference,
    createdAt: user.createdAt.toISOString(),
    stats: {
      completed: completedCount,
      active: activeCount,
      categories: categoryCount,
    },
  };
}

export async function updateProfile(
  userId: number,
  data: { name?: string; email?: string }
) {
  if (data.email) {
    const existing = await prisma.user.findFirst({
      where: { email: data.email, NOT: { id: userId } },
    });
    if (existing) {
      throw new AppError('Email is already in use.', 409);
    }
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data,
  });

  return { id: user.id, name: user.name, email: user.email };
}

export async function changePassword(
  userId: number,
  currentPassword: string,
  newPassword: string
) {
  if (!currentPassword || !newPassword) {
    throw new AppError('Current and new password are required.', 400);
  }
  if (newPassword.length < 5) {
    throw new AppError('New password must be at least 5 characters.', 400);
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError('User not found.', 404);
  }

  const isValid = await bcrypt.compare(currentPassword, user.password);
  if (!isValid) {
    throw new AppError('Current password is incorrect.', 400);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });
}

export async function updateTheme(userId: number, themePreference: string) {
  const validThemes = ['system', 'light', 'dark'];
  if (!validThemes.includes(themePreference)) {
    throw new AppError('Theme must be system, light, or dark.', 400);
  }

  await prisma.user.update({
    where: { id: userId },
    data: { themePreference },
  });
}

export async function deleteAccount(userId: number, password: string) {
  if (!password) {
    throw new AppError('Password is required to delete account.', 400);
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError('User not found.', 404);
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new AppError('Incorrect password.', 400);
  }

  await prisma.user.delete({ where: { id: userId } });
}
