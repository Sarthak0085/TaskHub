import { z } from 'zod';

export const signInSchema = z.object({
    email: z.string().trim().email('Invalid Email address'),
    password: z.string().min(8, 'Password must be atleast 8 characters long'),
});

export const signUpSchema = z
    .object({
        name: z.string().trim().min(3, 'Name must be atleast 3 characters long'),
        email: z.string().trim().email('Invalid Email Address'),
        password: z
            .string()
            .min(8, 'Password must be atleast 8 characters long')
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).+$/,
                'Password must contain uppercase, lowercase, number, and special character'
            ),
        confirmPassword: z
            .string()
            .min(8, 'Confirm Password must contain 8 characters')
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).+$/,
                'Password must contain uppercase, lowercase, number, and special character'
            ),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ['confirmPassword'],
        message: 'Password and Confirm Password must be same',
    });

export const forgotPasswordSchema = z.object({
    email: z.string().trim().email('Invalid Email Address'),
});

export const resetPasswordSchema = z
    .object({
        newPassword: z
            .string()
            .min(8, 'New Password must be atleast 8 characters long')
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).+$/,
                'Password must contain uppercase, lowercase, number, and special character'
            ),
        confirmPassword: z
            .string()
            .min(8, 'Confirm Password must contain 8 characters')
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).+$/,
                'Password must contain uppercase, lowercase, number, and special character'
            ),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        path: ['confirmPassword'],
        message: 'New Password and Confirm Password must be same',
    });

export const workspaceSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    color: z.string().min(3, 'Color must be at least 3 characters'),
    description: z.string().optional(),
});

export const projectSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().optional(),
    status: z.enum(['PLANNING', 'IN PROGRESS', 'ON HOLD', 'COMPLETED', 'CANCELLED']),
    startDate: z.string().min(10, 'Start date is required'),
    dueDate: z.string().min(10, 'Due date is required'),
    members: z
        .array(
            z.object({
                user: z.string(),
                role: z.enum(['MANAGER', 'CONTRIBUTOR', 'VIEWER']),
            })
        )
        .optional(),
    tags: z.string().optional(),
});

export const taskSchema = z.object({
    title: z.string().min(2, 'Task title is required'),
    description: z.string().optional(),
    status: z.enum(['TO DO', 'IN PROGRESS', 'DONE']),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
    dueDate: z.string().min(2, 'Due date is required'),
    assignees: z.array(z.string().min(2, 'Atleast one assignee is required')),
});

export const inviteMemberSchema = z.object({
    email: z.string().email('Invalid Email address'),
    role: z.enum(['ADMIN', 'MEMBER', 'VIEWER']),
});

export const changePasswordSchema = z
    .object({
        currentPassword: z
            .string()
            .min(1, { message: 'Current password is required' })
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).+$/,
                'Password must contain uppercase, lowercase, number, and special character'
            ),
        newPassword: z
            .string()
            .min(8, { message: 'New password must contains atleast 8 characters' })
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).+$/,
                'Password must contain uppercase, lowercase, number, and special character'
            ),
        confirmPassword: z
            .string()
            .min(8, { message: 'Confirm password must contains atleast 8 characters' })
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).+$/,
                'Password must contain uppercase, lowercase, number, and special character'
            ),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

export const profileSchema = z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    profilePicture: z.any().optional(),
});

export const verify2FAEnabledSchema = z.object({
    token: z.string().min(1, 'token is required'),
    otp: z
        .string()
        .length(6, 'OTP code is of 6 numbers')
        .regex(/^\d{6}$/, 'OTP must contain only digits'),
});
