import { Router } from 'express';
import authRouter from './auth.route.js';
import workspaceRouter from './workspace.route.js';
import projectRouter from './project.route.js';
import taskRouter from './task.route.js';
import userRouter from './user.route.js';

const router = Router();

// Auth Routes
router.use('/auth', authRouter);

// Workspace Routes
router.use('/workspaces', workspaceRouter);

// Project Routes
router.use('/projects', projectRouter);

// Task Routes
router.use('/tasks', taskRouter);

// User Routes
router.use('/user', userRouter);

export default router;
