import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Settings } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { type Workspace } from '@/types';
import { Button } from '@/components/ui/button';
import { workspaceSchema } from '@/lib/schema';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useUpdateWorkspaceMutation } from '@/hooks/use-workspace';

interface UpdateWorkspaceProps {
    workspaceId: string;
    workspace: Workspace;
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

type UpdateWorkspaceFormData = z.infer<typeof workspaceSchema>;

export const UpdateWorkspace = ({ workspaceId, workspace }: UpdateWorkspaceProps) => {
    const form = useForm<UpdateWorkspaceFormData>({
        resolver: zodResolver(workspaceSchema),
        defaultValues: {
            name: workspace?.name || '',
            description: workspace?.description || '',
            color: workspace?.color || '',
        },
        values: {
            name: workspace?.name || '',
            description: workspace?.description || '',
            color: workspace?.color || '',
        },
    });

    const { mutate, isPending } = useUpdateWorkspaceMutation();

    const onSubmit = (values: UpdateWorkspaceFormData) => {
        mutate(
            { workspaceId, values },
            {
                onSuccess: (data: any) => {
                    const message = data?.message || 'Workspace updated successfully';
                    toast.success(message);
                    form.reset();
                },
                onError: (error: any) => {
                    const errorMessage =
                        error?.response?.data?.message || 'Failed to update workspace';
                    console.error('Update Workspace Error :', error);
                    toast.error(errorMessage);
                },
            }
        );
    };

    return (
        <Card className="w-full mb-6 max-w-[500px]">
            <CardHeader>
                <CardTitle className="text-md font-semibold flex items-center gap-2">
                    <Settings className="size-4" /> Workspace Settings
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                    Manage your workspace settings and preferences
                </CardDescription>
            </CardHeader>

            <CardContent className="mt-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Workspace Title</FormLabel>
                                    <FormControl>
                                        <Input type="text" placeholder="Project Title" {...field} />
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
                                    <FormLabel>Workspace Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            rows={3}
                                            placeholder="Project Description"
                                            {...field}
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

                        <div className="flex justify-end">
                            <Button type="submit" className="w-fit" disabled={isPending}>
                                {isPending ? (
                                    <div className="flex gap-2 items-center justify-center">
                                        <Loader2 className="size-4 animate-spin" />
                                        <span className="text-center">saving...</span>
                                    </div>
                                ) : (
                                    'Save Changes'
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};
