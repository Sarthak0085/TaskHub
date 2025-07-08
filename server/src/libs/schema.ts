import { z } from 'zod';

export const registerSchema = z.object({
    name: z.string().trim().min(3, 'Name must be atleast 3 characters long'),
    email: z.string().trim().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
});

export const loginSchema = z.object({
    email: z.string().trim().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

export const verify2FAEnabledSchema = z.object({
    token: z.string().min(1, 'Token is required'),
    otp: z.string().min(6, 'OTP is required'),
});

export const verifyEmailSchema = z.object({
    token: z.string().min(1, 'Token is required'),
});

export const forgotPasswordSchema = z.object({
    email: z.string().email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
    token: z.string().min(1, 'Token is required'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters long'),
    confirmPassword: z.string().min(1, 'Confirm password is required'),
});

export const workspaceSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
    color: z.string().min(1, 'Color is required'),
});

export const inviteMemberSchema = z.object({
    email: z.string().email('Email is required'),
    role: z.enum(['ADMIN', 'MEMBER', 'VIEWER']),
});

export const tokenSchema = z.object({
    token: z.string().min(1, 'Token is required'),
});

export const projectSchema = z.object({
    title: z.string().min(3, 'Title is required'),
    description: z.string().optional(),
    status: z.enum(['PLANNING', 'IN PROGRESS', 'ON HOLD', 'COMPLETED', 'CANCELLED']),
    startDate: z.string(),
    dueDate: z.string().optional(),
    tags: z.string().optional(),
    members: z
        .array(
            z.object({
                user: z.string(),
                role: z.enum(['MANAGER', 'CONTRIBUTOR', 'VIEWER']),
            })
        )
        .optional(),
});

export const taskSchema = z.object({
    title: z.string().min(2, 'Task title is required'),
    description: z.string().optional(),
    status: z.enum(['TO DO', 'IN PROGRESS', 'DONE']),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
    dueDate: z.string().min(2, 'Due date is required'),
    assignees: z.array(z.string().min(2, 'Atleast one assignee is required')),
});

export const changePasswordSchema = z
    .object({
        currentPassword: z.string().min(1, { message: 'Current password is required' }),
        newPassword: z
            .string()
            .min(8, { message: 'New password must contains atleast 8 characters' }),
        confirmPassword: z
            .string()
            .min(8, { message: 'Confirm password must contains atleast 8 characters' }),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

export const profileSchema = z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    profilePicture: z.any().optional(),
});
