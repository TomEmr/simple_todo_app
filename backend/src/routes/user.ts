import { Router, Request, Response, NextFunction } from 'express';
import * as userService from '../services/userService';

const router = Router();

router.get('/profile', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const profile = await userService.getProfile(req.user!.id);
    res.json(profile);
  } catch (error) {
    next(error);
  }
});

router.patch('/profile', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.updateProfile(req.user!.id, req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.patch('/password', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { currentPassword, newPassword } = req.body;
    await userService.changePassword(req.user!.id, currentPassword, newPassword);
    res.json({ message: 'Password updated.' });
  } catch (error) {
    next(error);
  }
});

router.patch('/theme', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await userService.updateTheme(req.user!.id, req.body.themePreference);
    res.json({ message: 'Theme updated.' });
  } catch (error) {
    next(error);
  }
});

router.delete('/account', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await userService.deleteAccount(req.user!.id, req.body.password);
    res.clearCookie('accessToken', { path: '/' });
    res.json({ message: 'Account deleted.' });
  } catch (error) {
    next(error);
  }
});

export default router;
