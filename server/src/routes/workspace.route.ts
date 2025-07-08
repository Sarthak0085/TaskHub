import { Router } from 'express';
import { isAuthenticated } from '../middleware/auth.js';
import { validateRequest } from 'zod-express-middleware';
import { inviteMemberSchema, tokenSchema, workspaceSchema } from '../libs/schema.js';
import {
    acceptGenerateInvite,
    acceptInviteByToken,
    changeWorkspaceOwner,
    createWorkspace,
    deleteWorkspace,
    getArchivedData,
    getWorkspaceDetails,
    getWorkspaceProjects,
    getWorkspaces,
    getWorkspaceStats,
    inviteUserToWorkspace,
    updateWorkspace,
} from '../controllers/workspace.controller.js';
import { z } from 'zod';

const workspaceRouter = Router();

// create workspace
workspaceRouter.post(
    '/create',
    isAuthenticated,
    validateRequest({
        body: workspaceSchema,
    }),
    createWorkspace
);

// accept invite
workspaceRouter.post(
    '/accept-invite-token',
    isAuthenticated,
    validateRequest({ body: tokenSchema }),
    acceptInviteByToken
);

// invite user to workspace
workspaceRouter.post(
    '/:workspaceId/invite-member',
    isAuthenticated,
    validateRequest({
        params: z.object({
            workspaceId: z.string(),
        }),
        body: inviteMemberSchema,
    }),
    inviteUserToWorkspace
);

// accept generate invite
workspaceRouter.post(
    '/:workspaceId/accept-generate-invite',
    isAuthenticated,
    validateRequest({
        params: z.object({
            workspaceId: z.string(),
        }),
    }),
    acceptGenerateInvite
);

// update workspace
workspaceRouter.put(
    '/:workspaceId/update-workspace',
    isAuthenticated,
    validateRequest({
        params: z.object({
            workspaceId: z.string(),
        }),
        body: workspaceSchema,
    }),
    updateWorkspace
);

// change workspace owner
workspaceRouter.put(
    '/:workspaceId/change-ownership',
    isAuthenticated,
    validateRequest({
        params: z.object({
            workspaceId: z.string(),
        }),
        body: z.object({
            userId: z.string(),
            role: z.string(),
        }),
    }),
    changeWorkspaceOwner
);

// get workspaces
workspaceRouter.get('/', isAuthenticated, getWorkspaces);

// get workspace details
workspaceRouter.get(
    '/:workspaceId',
    isAuthenticated,
    validateRequest({
        params: z.object({
            workspaceId: z.string(),
        }),
    }),
    getWorkspaceDetails
);

// get workspace projects
workspaceRouter.get(
    '/:workspaceId/projects',
    isAuthenticated,
    validateRequest({
        params: z.object({
            workspaceId: z.string(),
        }),
    }),
    getWorkspaceProjects
);

// get workspace stats
workspaceRouter.get(
    '/:workspaceId/stats',
    isAuthenticated,
    validateRequest({
        params: z.object({
            workspaceId: z.string(),
        }),
    }),
    getWorkspaceStats
);

// get workspace archived proects and tasks
workspaceRouter.get(
    '/:workspaceId/archived-data',
    isAuthenticated,
    validateRequest({
        params: z.object({
            workspaceId: z.string(),
        }),
    }),
    getArchivedData
);

// delete workspace
workspaceRouter.delete(
    '/:workspaceId',
    isAuthenticated,
    validateRequest({
        params: z.object({
            workspaceId: z.string(),
        }),
    }),
    deleteWorkspace
);

export default workspaceRouter;
