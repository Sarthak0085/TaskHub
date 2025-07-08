import { Router } from 'express';
import { validateRequest } from 'zod-express-middleware';
import {
    forgotPasswordSchema,
    loginSchema,
    registerSchema,
    resetPasswordSchema,
    verify2FAEnabledSchema,
    verifyEmailSchema,
} from '../libs/schema.js';
import {
    forgotPassword,
    login,
    register,
    resetPassword,
    verify2FAEnabled,
    verifyEmail,
} from '../controllers/auth.controller.js';

const authRouter = Router();

// register
authRouter.post(
    '/register',
    validateRequest({
        body: registerSchema,
    }),
    register
);

// login
authRouter.post(
    '/login',
    validateRequest({
        body: loginSchema,
    }),
    login
);

// verify 2FA Enabled
authRouter.post(
    '/verify-twofa-enabled',
    validateRequest({
        body: verify2FAEnabledSchema,
    }),
    verify2FAEnabled
);

// verify email
authRouter.post(
    '/verify-email',
    validateRequest({
        body: verifyEmailSchema,
    }),
    verifyEmail
);

// forgot password
authRouter.post(
    '/forgot-password',
    validateRequest({
        body: forgotPasswordSchema,
    }),
    forgotPassword
);

// reset password
authRouter.post(
    '/reset-password',
    validateRequest({
        body: resetPasswordSchema,
    }),
    resetPassword
);

export default authRouter;
