import { projectSchema } from '@/lib/schema';
import { ProjectStatus, type Member } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import {
    Dialog,
    DialogContent,
    DialogDescription,
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { Calendar } from '../ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { Checkbox } from '../ui/checkbox';
import { useCreateProjectMutation } from '@/hooks/use-project';
import { toast } from 'sonner';

interface CreateProjectProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    workspaceId: string;
    workspaceMembers: Member[];
}

export type CreateProjectFormData = z.infer<typeof projectSchema>;

export const CreateProject = ({
    isOpen,
    onOpenChange,
    workspaceId,
    workspaceMembers,
}: CreateProjectProps) => {
    const form = useForm<CreateProjectFormData>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            title: '',
            description: '',
            status: 'PLANNING',
            startDate: '',
            dueDate: '',
            members: [],
            tags: undefined,
        },
    });

    const { mutate, isPending } = useCreateProjectMutation();

    const onSubmit = (values: CreateProjectFormData) => {
        if (!workspaceId) return;

        mutate(
            {
                projectData: values,
                workspaceId,
            },
            {
                onSuccess: () => {
                    toast.success('Project created successfully');
                    form.reset();
                    onOpenChange(false);
                },
                onError: (error: any) => {
                    const errorMessage = error.response.data.message;
                    toast.error(errorMessage || 'Failed to create project');
                    console.error('Create Project Error :', error);
                },
            }
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[540px] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create Project</DialogTitle>
                    <DialogDescription>Create a new project to get started</DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                        <div className="grid grid-cols-2 gap-2">
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
                                                            format(new Date(field.value), 'PPPP')
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
                                                            format(new Date(field.value), 'PPPP')
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
                                        <Input {...field} placeholder="Tags separated by comma" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="members"
                            render={({ field }) => {
                                const selectedMembers = field.value || [];

                                return (
                                    <FormItem>
                                        <FormLabel>Members</FormLabel>
                                        <FormControl>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant={'outline'}
                                                        className="w-full justify-start text-left font-normal min-h-11"
                                                    >
                                                        {selectedMembers.length === 0 ? (
                                                            <span className="text-muted-foreground">
                                                                Select Members
                                                            </span>
                                                        ) : selectedMembers.length <= 2 ? (
                                                            selectedMembers.map((m) => {
                                                                const member =
                                                                    workspaceMembers.find(
                                                                        (wm) =>
                                                                            wm.user._id === m.user
                                                                    );

                                                                return `${member?.user.name} (${member?.role})`;
                                                            })
                                                        ) : (
                                                            `${selectedMembers.length} members selected`
                                                        )}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent
                                                    className="w-full max-w-60 overflow-y-auto"
                                                    align="start"
                                                >
                                                    <div className="flex flex-col gap-2">
                                                        {workspaceMembers.map((member) => {
                                                            const selectedMember =
                                                                selectedMembers.find(
                                                                    (m) =>
                                                                        m.user === member.user._id
                                                                );

                                                            return (
                                                                <div
                                                                    key={member._id}
                                                                    className="flex items-center gap-2 p-2 border rounded"
                                                                >
                                                                    <Checkbox
                                                                        checked={!!selectedMember}
                                                                        onCheckedChange={(
                                                                            checked
                                                                        ) => {
                                                                            if (checked) {
                                                                                field.onChange([
                                                                                    ...selectedMembers,
                                                                                    {
                                                                                        user: member
                                                                                            .user
                                                                                            ._id,
                                                                                        role: 'CONTRIBUTOR',
                                                                                    },
                                                                                ]);
                                                                            } else {
                                                                                field.onChange(
                                                                                    selectedMembers.filter(
                                                                                        (m) =>
                                                                                            m.user !==
                                                                                            member
                                                                                                .user
                                                                                                ._id
                                                                                    )
                                                                                );
                                                                            }
                                                                        }}
                                                                        id={`member-${member.user._id}`}
                                                                    />
                                                                    <span className="truncate flex-1">
                                                                        {member.user.name}
                                                                    </span>

                                                                    {selectedMember && (
                                                                        <Select
                                                                            value={
                                                                                selectedMember.role
                                                                            }
                                                                            onValueChange={(
                                                                                role
                                                                            ) => {
                                                                                field.onChange(
                                                                                    selectedMembers.map(
                                                                                        (m) =>
                                                                                            m.user ===
                                                                                            member
                                                                                                .user
                                                                                                ._id
                                                                                                ? {
                                                                                                      ...m,
                                                                                                      role: role as
                                                                                                          | 'CONTRIBUTOR'
                                                                                                          | 'MANAGER'
                                                                                                          | 'VIEWER',
                                                                                                  }
                                                                                                : m
                                                                                    )
                                                                                );
                                                                            }}
                                                                        >
                                                                            <SelectTrigger>
                                                                                <SelectValue placeholder="Select Role" />
                                                                            </SelectTrigger>
                                                                            <SelectContent>
                                                                                <SelectItem value="MANAGER">
                                                                                    MANAGER
                                                                                </SelectItem>
                                                                                <SelectItem value="CONTRIBUTOR">
                                                                                    CONTRIBUTOR
                                                                                </SelectItem>
                                                                                <SelectItem value="VIEWER">
                                                                                    VIEWER
                                                                                </SelectItem>
                                                                            </SelectContent>
                                                                        </Select>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        />

                        <DialogFooter>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    'Create Project'
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
