import { Router, Request, Response, NextFunction } from 'express';
import * as categoryService from '../services/categoryService';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await categoryService.getCategories(req.user!.id);
    res.json(categories);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await categoryService.createCategory(req.user!.id, req.body);
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await categoryService.updateCategory(
      req.user!.id,
      Number(req.params.id),
      req.body
    );
    res.json(category);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await categoryService.deleteCategory(req.user!.id, Number(req.params.id));
    res.json({ message: 'Category deleted.' });
  } catch (error) {
    next(error);
  }
});

export default router;
