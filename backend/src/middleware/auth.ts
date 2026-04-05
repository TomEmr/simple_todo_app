import { Request, Response, NextFunction } from 'express';
import { User } from '@prisma/client';
import { verifyToken } from '../utils/jwt';
import { AppError } from '../utils/AppError';
import { prisma } from '../utils/prisma';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export async function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = req.cookies?.accessToken;
    if (!token) {
      throw new AppError('Authentication required.', 401);
    }

    const payload = verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      throw new AppError('User not found.', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError('Invalid or expired token.', 401));
    }
  }
}
