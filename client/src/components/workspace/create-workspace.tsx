import { workspaceSchema } from '@/lib/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import type { z } from 'zod';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCreateWorkspaceMutation } from '@/hooks/use-workspace';
import { toast } from 'sonner';

interface CreateWorkspaceProps {
    isCreatingWorkspace: boolean;
    setIsCreatingWorkspace: (isCreatingWorkspace: boolean) => void;
}

// Define 8 predefined colors
export const colorOptions = [
    '#FF5733', // Red-Orange
    '#33C1FF', // Blue
    '#28A745', // Green
    '#FFC300', // Yellow
    '#8E44AD', // Purple
    '#E67E22', // Orange
    '#2ECC71', // Light Green
    '#34495E', // Navy
];

export type WorkspaceForm = z.infer<typeof workspaceSchema>;

export const CreateWorkspace = ({
    isCreatingWorkspace,
    setIsCreatingWorkspace,
}: CreateWorkspaceProps) => {
    const form = useForm<WorkspaceForm>({
        resolver: zodResolver(workspaceSchema),
        defaultValues: {
            name: '',
            color: colorOptions[0],
            description: '',
        },
    });
    const navigate = useNavigate();
    const { mutate, isPending } = useCreateWorkspaceMutation();

    const onSubmit = (data: WorkspaceForm) => {
        mutate(data, {
            onSuccess: (data: any) => {
                form.reset();
                setIsCreatingWorkspace(false);
                toast.success('Workspace created successfully');
                navigate(`/workspaces/${data?._id}`);
            },
            onError: (error: any) => {
                const errorMessage = error?.response?.data?.message;
                toast.error(errorMessage);
                console.error('Create Workspace Error :', error);
            },
        });
    };

    return (
        <Dialog open={isCreatingWorkspace} onOpenChange={setIsCreatingWorkspace} modal={true}>
            <DialogContent className="max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create Workspace</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="space-y-4 py-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                placeholder="Workspace Name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                placeholder="Workspace Description"
                                                rows={3}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="color"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Color</FormLabel>
                                        <FormControl>
                                            <div className="flex gap-3 flex-wrap">
                                                {colorOptions.map((color) => (
                                                    <div
                                                        key={color}
                                                        onClick={() => field.onChange(color)}
                                                        className={cn(
                                                            'w-6 h-6 rounded-full cursor-pointer hover:opacity-80 transition-all duration-300',
                                                            field.value === color &&
                                                                'ring-2 ring-offset-2 ring-blue-500'
                                                        )}
                                                        style={{ backgroundColor: color }}
                                                    ></div>
                                                ))}
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter>
                            <Button type="submit" className="cursor-pointer" disabled={isPending}>
                                {isPending ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    'Create'
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
