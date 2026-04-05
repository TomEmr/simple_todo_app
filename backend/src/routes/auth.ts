import { Router, Request, Response, NextFunction } from 'express';
import * as authService from '../services/authService';
import { generateToken } from '../utils/jwt';
import { authMiddleware } from '../middleware/auth';

const router = Router();

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: false, // set true for HTTPS in production
  path: '/',
  maxAge: 86400000, // 1 day
};

router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;
    const user = await authService.register(name, email, password);
    const token = generateToken(user.id);
    res.cookie('accessToken', token, COOKIE_OPTIONS);
    res.status(201).json({ name: user.name, email: user.email, themePreference: 'system' });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await authService.login(email, password);
    const token = generateToken(user.id);
    res.cookie('accessToken', token, COOKIE_OPTIONS);
    res.json({
      name: user.name,
      email: user.email,
      themePreference: user.themePreference,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/logout', (_req: Request, res: Response) => {
  res.clearCookie('accessToken', { path: '/' });
  res.json({ message: 'Successfully logged out.' });
});

router.get('/me', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await authService.getMe(req.user!.id);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

export default router;
