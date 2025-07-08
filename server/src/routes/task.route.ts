import { Router } from 'express';
import { isAuthenticated } from '../middleware/auth.js';
import { validateRequest } from 'zod-express-middleware';
import { z } from 'zod';
import { taskSchema } from '../libs/schema.js';
import {
    addedComment,
    addSubTask,
    createTask,
    deleteTask,
    getActivityLogByResourceId,
    getCommentsByTaskId,
    getMyTasks,
    getTaskById,
    toggleArchiveTask,
    toggleWatchTask,
    updateSubTask,
    updateTaskAssignees,
    updateTaskDescription,
    updateTaskPriority,
    updateTaskStatus,
    updateTaskTitle,
} from '../controllers/task.controller.js';

const taskRouter = Router();

// create task
taskRouter.post(
    '/:projectId/create-task',
    isAuthenticated,
    validateRequest({
        params: z.object({
            projectId: z.string(),
        }),
        body: taskSchema,
    }),
    createTask
);

// add subtask
taskRouter.post(
    '/:taskId/add-subtask',
    isAuthenticated,
    validateRequest({
        params: z.object({
            taskId: z.string(),
        }),
        body: z.object({
            title: z.string(),
        }),
    }),
    addSubTask
);

// added comment
taskRouter.post(
    '/:taskId/add-comment',
    isAuthenticated,
    validateRequest({
        params: z.object({
            taskId: z.string(),
        }),
        body: z.object({
            text: z.string(),
        }),
    }),
    addedComment
);

// update task title
taskRouter.put(
    '/:taskId/title',
    isAuthenticated,
    validateRequest({
        params: z.object({
            taskId: z.string(),
        }),
        body: z.object({
            title: z.string(),
        }),
    }),
    updateTaskTitle
);

// update task description
taskRouter.put(
    '/:taskId/description',
    isAuthenticated,
    validateRequest({
        params: z.object({
            taskId: z.string(),
        }),
        body: z.object({
            description: z.string(),
        }),
    }),
    updateTaskDescription
);

// update task status
taskRouter.put(
    '/:taskId/status',
    isAuthenticated,
    validateRequest({
        params: z.object({
            taskId: z.string(),
        }),
        body: z.object({
            status: z.string(),
        }),
    }),
    updateTaskStatus
);

// update task assignees
taskRouter.put(
    '/:taskId/assignees',
    isAuthenticated,
    validateRequest({
        params: z.object({
            taskId: z.string(),
        }),
        body: z.object({
            assignees: z.array(z.string()),
        }),
    }),
    updateTaskAssignees
);

// update task priority
taskRouter.put(
    '/:taskId/priority',
    isAuthenticated,
    validateRequest({
        params: z.object({
            taskId: z.string(),
        }),
        body: z.object({
            priority: z.string(),
        }),
    }),
    updateTaskPriority
);

// update subtask
taskRouter.put(
    '/:taskId/update-subtask/:subtaskId',
    isAuthenticated,
    validateRequest({
        params: z.object({
            taskId: z.string(),
            subtaskId: z.string(),
        }),
        body: z.object({
            completed: z.boolean(),
        }),
    }),
    updateSubTask
);

// toggle watch unwatch task
taskRouter.put(
    '/:taskId/watch',
    isAuthenticated,
    validateRequest({
        params: z.object({
            taskId: z.string(),
        }),
    }),
    toggleWatchTask
);

// toggle archive unarchive task
taskRouter.put(
    '/:taskId/archived',
    isAuthenticated,
    validateRequest({
        params: z.object({
            taskId: z.string(),
        }),
    }),
    toggleArchiveTask
);

// get task by taskId
taskRouter.get('/my-tasks', isAuthenticated, getMyTasks);

// get task by taskId
taskRouter.get(
    '/:taskId',
    isAuthenticated,
    validateRequest({
        params: z.object({
            taskId: z.string(),
        }),
    }),
    getTaskById
);

// get comments by taskId
taskRouter.get(
    '/:taskId/comments',
    isAuthenticated,
    validateRequest({
        params: z.object({
            taskId: z.string(),
        }),
    }),
    getCommentsByTaskId
);

// get activity by resourceId
taskRouter.get(
    '/:resourceId/activity',
    isAuthenticated,
    validateRequest({
        params: z.object({
            resourceId: z.string(),
        }),
    }),
    getActivityLogByResourceId
);

// delete task
taskRouter.delete(
    '/:taskId',
    isAuthenticated,
    validateRequest({
        params: z.object({
            taskId: z.string(),
        }),
    }),
    deleteTask
);

export default taskRouter;
