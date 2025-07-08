import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BackButton } from '@/components/ui/back-button';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ProjectStatus, type Project } from '@/types';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { projectSchema } from '@/lib/schema';
import { useUpdateProjectMutation } from '@/hooks/use-project';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface UpdateProjectProps {
    projectId: string;
    project: Project;
}

type UpdateProjectFormData = z.infer<typeof projectSchema>;

export const UpdateProject = ({ projectId, project }: UpdateProjectProps) => {
    const form = useForm<UpdateProjectFormData>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            title: project?.title || '',
            description: project?.description || '',
            status: project?.status || 'PLANNING',
            startDate: format(project?.startDate, 'MMMM d, yyyy') || '',
            dueDate: format(project?.dueDate, 'MMMM d, yyyy') || '',
            tags: project?.tags.length > 0 ? project?.tags.join(', ') : '',
        },
        values: {
            title: project?.title || '',
            description: project?.description || '',
            status: project?.status || 'PLANNING',
            startDate: format(project?.startDate, 'MMMM d, yyyy') || '',
            dueDate: format(project?.dueDate, 'MMMM d, yyyy') || '',
            tags: project?.tags.length > 0 ? project?.tags.join(', ') : '',
        },
    });

    const { mutate, isPending } = useUpdateProjectMutation();

    const onSubmit = (values: UpdateProjectFormData) => {
        mutate(
            { projectId, projectData: values },
            {
                onSuccess: (data: any) => {
                    const message = data?.message || 'Project updated successfully';
                    toast.success(message);
                    form.reset();
                },
                onError: (error: any) => {
                    const errorMessage =
                        error?.response?.data?.message || 'Failed to update project';
                    console.error('Update Project Error :', error);
                    toast.error(errorMessage);
                },
            }
        );
    };

    return (
        <Card className="w-full mb-6 max-w-[500px]">
            <CardHeader>
                <div>
                    <BackButton />
                </div>
                <CardTitle className="text-md">Project Settings</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                    Update your project details or delete project
                </CardDescription>
            </CardHeader>

            <CardContent className="mt-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Project Title</FormLabel>
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
                                    <FormLabel>Project Description</FormLabel>
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
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Project Status</FormLabel>
                                    <FormControl>
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select Project Status" />
                                            </SelectTrigger>

                                            <SelectContent>
                                                {Object.values(ProjectStatus).map((status) => (
                                                    <SelectItem key={status} value={status}>
                                                        {status}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid md:grid-cols-2 gap-2">
                            <FormField
                                control={form.control}
                                name="startDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Start Date</FormLabel>
                                        <FormControl>
                                            <Popover modal={true}>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant={'outline'}
                                                        className={cn(
                                                            'w-full justify-start text-left font-normal',
                                                            !field.value && 'text-muted-foreground'
                                                        )}
                                                    >
                                                        <CalendarIcon className="size-4 mr-2" />
                                                        {field.value ? (
                                                            format(
                                                                new Date(field.value),
                                                                'MMMM d, yyyy'
                                                            )
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
                                                    </Button>
                                                </PopoverTrigger>

                                                <PopoverContent>
                                                    <Calendar
                                                        mode="single"
                                                        selected={
                                                            field.value
                                                                ? new Date(field.value)
                                                                : undefined
                                                        }
                                                        onSelect={(date) => {
                                                            field.onChange(
                                                                date?.toISOString() || undefined
                                                            );
                                                        }}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="dueDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Due Date</FormLabel>
                                        <FormControl>
                                            <Popover modal={true}>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant={'outline'}
                                                        className={cn(
                                                            'w-full justify-start text-right font-normal',
                                                            !field.value && 'text-muted-foreground'
                                                        )}
                                                    >
                                                        <CalendarIcon className="size-4 mr-2" />
                                                        {field.value ? (
                                                            format(
                                                                new Date(field.value),
                                                                'MMMM d, yyyy'
                                                            )
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
                                                    </Button>
                                                </PopoverTrigger>

                                                <PopoverContent>
                                                    <Calendar
                                                        mode="single"
                                                        selected={
                                                            field.value
                                                                ? new Date(field.value)
                                                                : undefined
                                                        }
                                                        onSelect={(date) =>
                                                            field.onChange(
                                                                date?.toISOString() || undefined
                                                            )
                                                        }
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="tags"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tags</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="text"
                                            placeholder="Tags separated by comma"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

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
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};
