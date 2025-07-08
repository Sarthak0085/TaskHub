import type { CreateProjectFormData } from '@/components/project/create-project';
import { deleteData, fetchData, postData, updateData } from '@/lib/fetch-util';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// create project mutation
export const useCreateProjectMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { projectData: CreateProjectFormData; workspaceId: string }) =>
            postData(`/projects/${data.workspaceId}/create-project`, data.projectData),
        onSuccess: (data: any) => {
            console.log('query', data);
            queryClient.invalidateQueries({
                queryKey: ['workspace', data?.newProject?.workspace],
            });
        },
    });
};

// get project query
export const useGetProjectQuery = (projectId: string) => {
    console.log('project id', projectId);
    return useQuery({
        queryKey: ['project', projectId],
        queryFn: async () => fetchData(`/projects/${projectId}/tasks`),
        enabled: !!projectId,
    });
};

// update project mutation
export const useUpdateProjectMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { projectData: CreateProjectFormData; projectId: string }) =>
            updateData(`/projects/${data.projectId}/update-project`, data.projectData),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({
                queryKey: ['workspace', data?.project?.workspace],
            });
            queryClient.invalidateQueries({
                queryKey: ['project', data?.project?._id],
            });
        },
    });
};

// delete project mutation
export const useDeleteProjectMutation = () => {
    return useMutation({
        mutationFn: async (projectId: string) => deleteData(`/projects/${projectId}`),
    });
};
