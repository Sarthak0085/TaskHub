import type { CreateTaskFormData } from '@/components/task/create-task';
import { deleteData, fetchData, postData, updateData } from '@/lib/fetch-util';
import type { TaskPriority, TaskStatus } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// create task mutation
export const useCreateTaskMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { projectId: string; task: CreateTaskFormData }) =>
            postData(`/tasks/${data.projectId}/create-task`, data.task),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({
                queryKey: ['project', data.task.project],
            });
        },
    });
};

// add comment mutation
export const useAddCommentMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { taskId: string; text: string }) =>
            postData(`/tasks/${data.taskId}/add-comment`, { text: data.text }),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({
                queryKey: ['comments', data?.newComment?.task],
            });
            queryClient.invalidateQueries({
                queryKey: ['task-activity', data?.newComment?.task],
            });
        },
    });
};

// get task query
export const useGetTaskQuery = (taskId: string) => {
    return useQuery({
        queryKey: ['task', taskId],
        queryFn: async () => fetchData(`/tasks/${taskId}`),
    });
};

// get comments by taskId
export const useGetCommentsByTaskId = (taskId: string) => {
    return useQuery({
        queryKey: ['comments', taskId],
        queryFn: async () => fetchData(`/tasks/${taskId}/comments`),
    });
};

// update task title mutation
export const useUpdateTaskTitleMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { taskId: string; title: string }) =>
            updateData(`/tasks/${data?.taskId}/title`, { title: data?.title }),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({
                queryKey: ['task', data?.task?._id],
            });
            queryClient.invalidateQueries({
                queryKey: ['task-activity', data?.task?._id],
            });
        },
    });
};

// update task watch mutation
export const useToggleWatchTaskMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { taskId: string }) => updateData(`/tasks/${data?.taskId}/watch`, {}),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({
                queryKey: ['task', data?.task?._id],
            });
            queryClient.invalidateQueries({
                queryKey: ['task-activity', data?.task?._id],
            });
        },
    });
};

// update task watch mutation
export const useToggleArchivedTaskMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { taskId: string }) => updateData(`/tasks/${data?.taskId}/archived`, {}),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({
                queryKey: ['task', data?.task?._id],
            });
            queryClient.invalidateQueries({
                queryKey: ['task-activity', data?.task?._id],
            });
        },
    });
};

// update task description mutation
export const useUpdateTaskDescriptionMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { taskId: string; description: string }) =>
            updateData(`/tasks/${data?.taskId}/description`, { description: data?.description }),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({
                queryKey: ['task', data?.task?._id],
            });
            queryClient.invalidateQueries({
                queryKey: ['task-activity', data?.task?._id],
            });
        },
    });
};

// update task status mutation
export const useUpdateTaskStatusMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { taskId: string; status: TaskStatus }) =>
            updateData(`/tasks/${data?.taskId}/status`, { status: data?.status }),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({
                queryKey: ['task', data?.task?._id],
            });
            queryClient.invalidateQueries({
                queryKey: ['task-activity', data?.task?._id],
            });
            queryClient.invalidateQueries({
                queryKey: ['project', data?.task?.project],
            });
        },
    });
};

// update task priority mutation
export const useUpdateTaskAssigneesMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { taskId: string; assignees: string[] }) =>
            updateData(`/tasks/${data?.taskId}/assignees`, { assignees: data?.assignees }),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({
                queryKey: ['task', data?.task?._id],
            });
            queryClient.invalidateQueries({
                queryKey: ['task-activity', data?.task?._id],
            });
        },
    });
};

// update task priority mutation
export const useUpdateTaskPriorityMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { taskId: string; priority: TaskPriority }) =>
            updateData(`/tasks/${data?.taskId}/priority`, { priority: data?.priority }),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({
                queryKey: ['task', data?.task?._id],
            });
            queryClient.invalidateQueries({
                queryKey: ['task-activity', data?.task?._id],
            });
        },
    });
};

// add subtask mutation
export const useAddSubtaskMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { taskId: string; title: string }) =>
            postData(`/tasks/${data?.taskId}/add-subtask`, { title: data?.title }),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({
                queryKey: ['task', data?.task?._id],
            });
            queryClient.invalidateQueries({
                queryKey: ['task-activity', data?.task?._id],
            });
        },
    });
};

// update subtask mutation
export const useUpdateSubtaskMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { taskId: string; subtaskId: string; completed: boolean }) =>
            updateData(`/tasks/${data?.taskId}/update-subtask/${data.subtaskId}`, {
                completed: data?.completed,
            }),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({
                queryKey: ['task', data?.task?._id],
            });
            queryClient.invalidateQueries({
                queryKey: ['task-activity', data?.task?._id],
            });
        },
    });
};

// get activity log by resourceId
export const useGetActivityLogByResourceId = (resourceId: string) => {
    return useQuery({
        queryKey: ['task-activity', resourceId],
        queryFn: async () => fetchData(`/tasks/${resourceId}/activity`),
    });
};

// get my tasks query
export const useGetMyTasksQuery = (workspaceId: string) => {
    return useQuery({
        queryKey: ['my-tasks', 'user', workspaceId],
        queryFn: async () => fetchData(`/tasks/my-tasks?workspaceId=${workspaceId}`),
    });
};

// use delete task mutation
export const useDeleteTaskMutation = () => {
    return useMutation({
        mutationFn: (taskId: string) => deleteData(`/tasks/${taskId}`),
    });
};
