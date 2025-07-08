import type { WorkspaceForm } from '@/components/workspace/create-workspace';
import type { InviteMemberFormData } from '@/components/workspace/invite-member';
import { deleteData, fetchData, postData, updateData } from '@/lib/fetch-util';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// create workspace mutation
export const useCreateWorkspaceMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: WorkspaceForm) => postData('/workspaces/create', data),
        onSuccess: () => [
            queryClient.invalidateQueries({
                queryKey: ['workspaces'],
            }),
        ],
    });
};

// get workspaces query
export const useGetWorkspacesQuery = () => {
    return useQuery({
        queryKey: ['workspaces'],
        queryFn: async () => fetchData('/workspaces'),
    });
};

// get workspace project query
export const useGetWorkspaceQuery = (workspaceId: string) => {
    return useQuery({
        queryKey: ['workspace', workspaceId],
        queryFn: async () => fetchData(`/workspaces/${workspaceId}/projects`),
    });
};

// get workspace stats query
export const useGetWorkspaceStatsQuery = (workspaceId: string) => {
    return useQuery({
        queryKey: ['workspace', workspaceId, 'stats'],
        queryFn: async () => fetchData(`/workspaces/${workspaceId}/stats`),
    });
};

// get workspace details query
export const useGetWorkspaceDetailsQuery = (workspaceId: string) => {
    return useQuery({
        queryKey: ['workspace', workspaceId, 'details'],
        queryFn: async () => fetchData(`/workspaces/${workspaceId}`),
    });
};

// invite member to workspace mutation
export const useInvitationMemberMutation = () => {
    return useMutation({
        mutationFn: (data: { workspaceId: string; values: InviteMemberFormData }) =>
            postData(`/workspaces/${data?.workspaceId}/invite-member`, data.values),
    });
};

// accept generate invite mutation
export const useAcceptGenerateInviteMutation = () => {
    return useMutation({
        mutationFn: (workspaceId: string) =>
            postData(`/workspaces/${workspaceId}/accept-generate-invite`, {}),
    });
};

// accept invitation token mutation
export const useAcceptInvitationTokenMutation = () => {
    return useMutation({
        mutationFn: (token: string) => postData(`/workspaces/accept-invite-token`, { token }),
    });
};

// update workspace mutation
export const useUpdateWorkspaceMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: { workspaceId: string; values: any }) =>
            updateData(`/workspaces/${data?.workspaceId}/update-workspace`, data?.values),
        onSuccess: (data: any) => {
            console.log('data', data);
            (queryClient.invalidateQueries({
                queryKey: ['workspace', data?.workspace?._id, 'details'],
            }),
                queryClient.invalidateQueries({
                    queryKey: ['workspace', data?.workspace?._id],
                }),
                queryClient.invalidateQueries({
                    queryKey: ['workspaces'],
                }));
        },
    });
};

// change workspace ownership mutation
export const useChangeOwnershipMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: { workspaceId: string; values: any }) =>
            updateData(`/workspaces/${data?.workspaceId}/change-ownership`, data?.values),
        onSuccess: (data: any) => {
            (queryClient.invalidateQueries({
                queryKey: ['workspace', data?.workspace?._id, 'details'],
            }),
                queryClient.invalidateQueries({
                    queryKey: ['workspaces'],
                }));
        },
    });
};

// get workspace achived projects and tasks mutation
export const useGetArchivedDataQuery = (workspaceId: string) => {
    return useQuery({
        queryKey: ['archived', workspaceId],
        queryFn: async () => fetchData(`/workspaces/${workspaceId}/archived-data`),
    });
};

// delete workspace mutation
export const useDeleteWorkspaceMutation = () => {
    return useMutation({
        mutationFn: (workspaceId: string) => deleteData(`/workspaces/${workspaceId}`),
    });
};
