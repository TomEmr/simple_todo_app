import { Router, Request, Response, NextFunction } from 'express';
import * as taskService from '../services/taskService';

const router = Router();

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await taskService.createTask(req.user!.id, req.body);
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, categoryId, dueDate } = req.query;
    const tasks = await taskService.getTasks(req.user!.id, {
      status: status as string | undefined,
      categoryId: categoryId ? Number(categoryId) : undefined,
      dueDate: dueDate as string | undefined,
    });
    res.json(tasks);
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await taskService.updateTask(
      req.user!.id,
      Number(req.params.id),
      req.body
    );
    res.json(task);
  } catch (error) {
    next(error);
  }
});

router.delete('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await taskService.deleteAllCompleted(req.user!.id);
    res.json({ message: 'All completed tasks deleted.' });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await taskService.deleteTask(req.user!.id, Number(req.params.id));
    res.json({ message: 'Task deleted.' });
  } catch (error) {
    next(error);
  }
});

router.put('/reorder', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await taskService.reorderTasks(req.user!.id, req.body);
    res.json({ message: 'Tasks reordered.' });
  } catch (error) {
    next(error);
  }
});

export default router;
