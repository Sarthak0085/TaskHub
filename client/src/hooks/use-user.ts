import { fetchData, postData, updateData } from '@/lib/fetch-util';
import type { ChangePasswordFormData, ProfileFormData } from '@/pages/user/profile';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// use get user profile query
export const useGetUserProfileQuery = () => {
    return useQuery({
        queryKey: ['user', 'profile'],
        queryFn: async () => fetchData(`/user/profile`),
    });
};

// use update user profile mutation
export const useUpdateUserProfileMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: ProfileFormData) => updateData(`/user/profile`, data),
        onSuccess: () => {
            (queryClient.invalidateQueries({
                queryKey: ['user', 'profile'],
            }),
                queryClient.invalidateQueries({
                    queryKey: ['workspaces'],
                }));
        },
    });
};

// use change password mutation
export const useChangePasswordMutation = () => {
    return useMutation({
        mutationFn: (data: ChangePasswordFormData) => postData(`/user/change-password`, data),
    });
};

// use toggle 2fa enabled mutation
export const useToggleTwoFAEnabledMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (is2FAEnabled: boolean) => updateData(`/user/twofaenabled`, { is2FAEnabled }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['user', 'profile'],
            });
        },
    });
};
