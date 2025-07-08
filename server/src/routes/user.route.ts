import { Router } from 'express';
import { isAuthenticated } from '../middleware/auth.js';
import {
    changePassword,
    getUserProfile,
    toggleTwoFactorEnabled,
    updateUserProfile,
} from '../controllers/user.controller.js';
import { validateRequest } from 'zod-express-middleware';
import { changePasswordSchema, profileSchema } from '../libs/schema.js';

const userRouter = Router();

// change password
userRouter.post(
    '/change-password',
    isAuthenticated,
    validateRequest({
        body: changePasswordSchema,
    }),
    changePassword
);

// update profile
userRouter.put(
    '/profile',
    isAuthenticated,
    validateRequest({
        body: profileSchema,
    }),
    updateUserProfile
);

// toggle 2fa enabled
userRouter.put('/twofaenabled', isAuthenticated, toggleTwoFactorEnabled);

// get profile data
userRouter.get('/profile', isAuthenticated, getUserProfile);

export default userRouter;
