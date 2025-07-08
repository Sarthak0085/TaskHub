import { useState } from 'react';
import { DeleteDialog } from '../delete-dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useDeleteWorkspaceMutation } from '@/hooks/use-workspace';

export const DeleteWorkspace = ({ workspaceId }: { workspaceId: string }) => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const { mutate, isPending } = useDeleteWorkspaceMutation();

    const handleDelete = () => {
        mutate(workspaceId, {
            onSuccess: (data: any) => {
                const message = data?.message || `Workspace ${data?.title} deleted successfully`;
                toast.success(message);
                setIsOpen(false);
                navigate('/workspaces');
            },
            onError: (error: any) => {
                const errorMessage = error?.response?.data?.message || 'Failed to delete workspace';
                console.error('Delete Workspace Error :', error);
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
                    Irreversible actions for your workspace
                </CardDescription>
            </CardHeader>

            <CardContent>
                <DeleteDialog
                    isOpen={isOpen}
                    onOpenChange={setIsOpen}
                    isPending={isPending}
                    buttonText="Delete Workspace"
                    description="This action cannot be undone. This will permanently delete the workspace and related projects and tasks from our servers"
                    handleDelete={handleDelete}
                />
            </CardContent>
        </Card>
    );
};
