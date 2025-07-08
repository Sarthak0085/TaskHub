import { Router } from 'express';
import { isAuthenticated } from '../middleware/auth.js';
import { validateRequest } from 'zod-express-middleware';
import { projectSchema } from '../libs/schema.js';
import {
    createProject,
    deleteProject,
    getProjectDetails,
    getProjectTasks,
    updateProject,
} from '../controllers/project.controller.js';
import { z } from 'zod';

const projectRouter = Router();

// create project
projectRouter.post(
    '/:workspaceId/create-project',
    isAuthenticated,
    validateRequest({
        params: z.object({
            workspaceId: z.string(),
        }),
        body: projectSchema,
    }),
    createProject
);

// update project
projectRouter.put(
    '/:projectId/update-project',
    isAuthenticated,
    validateRequest({
        params: z.object({
            projectId: z.string(),
        }),
        body: projectSchema,
    }),
    updateProject
);

// get project details
projectRouter.get(
    '/:projectId',
    isAuthenticated,
    validateRequest({
        params: z.object({
            projectId: z.string(),
        }),
    }),
    getProjectDetails
);

// get project tasks
projectRouter.get(
    '/:projectId/tasks',
    isAuthenticated,
    validateRequest({
        params: z.object({
            projectId: z.string(),
        }),
    }),
    getProjectTasks
);

// delete project
projectRouter.delete(
    '/:projectId',
    isAuthenticated,
    validateRequest({
        params: z.object({
            projectId: z.string(),
        }),
    }),
    deleteProject
);

export default projectRouter;
