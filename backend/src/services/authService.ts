import bcrypt from 'bcryptjs';
import { AppError } from '../utils/AppError';
import { prisma } from '../utils/prisma';
import { initDefaultCategories } from './categoryService';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 5;

export async function register(name: string, email: string, password: string) {
  if (!name || !email || !password) {
    throw new AppError('Name, email, and password are required.', 400);
  }
  if (!EMAIL_REGEX.test(email)) {
    throw new AppError('Invalid email format.', 400);
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new AppError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`, 400);
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new AppError('User with this email already exists.', 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });

  await initDefaultCategories(user.id);

  return { id: user.id, name: user.name, email: user.email };
}

export async function login(email: string, password: string) {
  if (!email || !password) {
    throw new AppError('Email and password are required.', 400);
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError('Invalid email or password.', 401);
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new AppError('Invalid email or password.', 401);
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    themePreference: user.themePreference,
  };
}

export async function getMe(userId: number) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError('User not found.', 404);
  }
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    themePreference: user.themePreference,
  };
}
