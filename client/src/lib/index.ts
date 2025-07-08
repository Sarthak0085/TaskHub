import type { ProjectStatus, TaskStatus } from '@/types';

export const publicRoutes = [
    '/',
    '/auth/sign-in',
    '/auth/sign-up',
    '/auth/verify-email',
    '/auth/reset-password',
    '/auth/forgot-password',
    '/auth/verify-otp',
    '*',
];

export const getTaskStatusColor = (status: ProjectStatus) => {
    switch (status) {
        case 'IN PROGRESS':
            return 'bg-blue-100 font-bold p-1 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
        case 'COMPLETED':
            return 'bg-green-100 font-bold p-1 text-green-800 dark:bg-green-900/30 dark:text-green-300';
        case 'CANCELLED':
            return 'bg-red-100 font-bold p-1 text-red-800 dark:bg-red-900/30 dark:text-red-300';
        case 'ON HOLD':
            return 'bg-yellow-100 font-bold p-1 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
        case 'PLANNING':
            return 'bg-purple-100 font-bold p-1 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
        default:
            return 'bg-gray-100 font-bold p-1 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
};

export const getProjectProgress = (tasks: { status: TaskStatus }[]) => {
    const totalTasks = tasks.length;

    const completedTasks = tasks.filter((task) => task.status === 'DONE').length;

    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return progress;
};
