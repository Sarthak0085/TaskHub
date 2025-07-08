import { useState } from 'react';
import { DeleteDialog } from '../delete-dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useDeleteProjectMutation } from '@/hooks/use-project';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const DeleteProject = ({ projectId }: { projectId: string }) => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const { mutate, isPending } = useDeleteProjectMutation();

    const handleDelete = () => {
        mutate(projectId, {
            onSuccess: (data: any) => {
                const message = data?.message || `Project ${data?.title} deleted successfully`;
                toast.success(message);
                setIsOpen(false);
                navigate('/workspaces');
            },
            onError: (error: any) => {
                const errorMessage = error?.response?.data?.message || 'Failed to delete project';
                console.error('Delete Project Error :', error);
                toast.error(errorMessage);
            },
        });
    };
    return (
        <Card className="w-full mb-6 max-w-[500px]">
            <CardHeader>
                <CardTitle className="text-destructive text-md font-semibold">
                    Danger Zone
                </CardTitle>
                <CardDescription className="text-muted-foreground text-sm">
                    Irreversible actions for your project
                </CardDescription>
            </CardHeader>

            <CardContent>
                <DeleteDialog
                    isOpen={isOpen}
                    onOpenChange={setIsOpen}
                    isPending={isPending}
                    buttonText="Delete Project"
                    description="This action cannot be undone. This will permanently delete the project from our servers"
                    handleDelete={handleDelete}
                />
            </CardContent>
        </Card>
    );
};
