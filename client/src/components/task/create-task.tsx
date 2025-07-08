import { taskSchema } from '@/lib/schema';
import type { ProjectMemberRole, User } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { useCreateTaskMutation } from '@/hooks/use-task';
import { toast } from 'sonner';

interface CreateTaskProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    projectId: string;
    projectMembers: { user: User; role: ProjectMemberRole }[];
}

export type CreateTaskFormData = z.infer<typeof taskSchema>;

export const CreateTask = ({ open, onOpenChange, projectId, projectMembers }: CreateTaskProps) => {
    const form = useForm<CreateTaskFormData>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            title: '',
            description: '',
            status: 'TO DO',
            priority: 'MEDIUM',
            dueDate: '',
            assignees: [],
        },
    });

    const { mutate, isPending } = useCreateTaskMutation();

    const onSubmit = (values: CreateTaskFormData) => {
        mutate(
            {
                projectId: projectId,
                task: values,
            },
            {
                onSuccess: () => {
                    toast.success('Task Created Successfully');
                    form.reset();
                    onOpenChange(false);
                },
                onError: (error: any) => {
                    const errorMessage = error.response.data.message;
                    toast.error(errorMessage || 'An Unknown error occured');
                    console.error('Create Task Error :', error);
                },
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Task</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    placeholder="Enter task title"
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
                                                    placeholder="Enter task description"
                                                    rows={3}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid gap-4 md:grid-cols-2">
                                    <FormField
                                        control={form.control}
                                        name="status"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Status</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                    >
                                                        <FormItem>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select Status" />
                                                                </SelectTrigger>
                                                            </FormControl>

                                                            <SelectContent>
                                                                <SelectItem value="TO DO">
                                                                    TO DO
                                                                </SelectItem>
                                                                <SelectItem value="IN PROGRESS">
                                                                    IN PROGRESS
                                                                </SelectItem>
                                                                <SelectItem value="DONE">
                                                                    DONE
                                                                </SelectItem>
                                                            </SelectContent>
                                                        </FormItem>
                                                    </Select>
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="priority"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Priority</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                    >
                                                        <FormItem>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select Priority" />
                                                                </SelectTrigger>
                                                            </FormControl>

                                                            <SelectContent>
                                                                <SelectItem value="LOW">
                                                                    LOW
                                                                </SelectItem>
                                                                <SelectItem value="MEDIUM">
                                                                    MEDIUM
                                                                </SelectItem>
                                                                <SelectItem value="HIGH">
                                                                    HIGH
                                                                </SelectItem>
                                                            </SelectContent>
                                                        </FormItem>
                                                    </Select>
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>

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
                                                                'w-full justify-start text-left font-normal',
                                                                !field.value &&
                                                                    'text-muted-foreground'
                                                            )}
                                                        >
                                                            <CalendarIcon className="size-4 mr-2" />
                                                            {field.value ? (
                                                                format(
                                                                    new Date(field.value),
                                                                    'PPPP'
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
                                    name="assignees"
                                    render={({ field }) => {
                                        const selectedMembers = field.value || [];

                                        return (
                                            <FormItem>
                                                <FormLabel>Assignees</FormLabel>
                                                <FormControl>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button
                                                                variant={'outline'}
                                                                className="w-full justify-start text-left min-h-11"
                                                            >
                                                                {selectedMembers.length === 0 ? (
                                                                    <span className="text-muted-foreground">
                                                                        Select assignees
                                                                    </span>
                                                                ) : selectedMembers.length <= 2 ? (
                                                                    selectedMembers
                                                                        .map((sm) => {
                                                                            const member =
                                                                                projectMembers.find(
                                                                                    (pm) =>
                                                                                        pm.user
                                                                                            ?._id ===
                                                                                        sm
                                                                                );
                                                                            return `${member?.user?.name}`;
                                                                        })
                                                                        .join(', ')
                                                                ) : (
                                                                    `${selectedMembers.length} assignees selected`
                                                                )}
                                                            </Button>
                                                        </PopoverTrigger>

                                                        <PopoverContent
                                                            className="w-sm max-h-60 overflow-y-auto p-2"
                                                            align="start"
                                                        >
                                                            <div className="flex flex-col gap-2">
                                                                {projectMembers.map((member) => {
                                                                    const selectedMember =
                                                                        selectedMembers.find(
                                                                            (sm) =>
                                                                                sm ===
                                                                                member?.user?._id
                                                                        );

                                                                    return (
                                                                        <div
                                                                            key={member?.user?._id}
                                                                            className="flex items-center gap-2 p-2 border rounded"
                                                                        >
                                                                            <Checkbox
                                                                                checked={
                                                                                    !!selectedMember
                                                                                }
                                                                                onCheckedChange={(
                                                                                    checked
                                                                                ) => {
                                                                                    if (checked) {
                                                                                        field.onChange(
                                                                                            [
                                                                                                ...selectedMembers,
                                                                                                member
                                                                                                    ?.user
                                                                                                    ?._id,
                                                                                            ]
                                                                                        );
                                                                                    } else {
                                                                                        field.onChange(
                                                                                            selectedMembers.filter(
                                                                                                (
                                                                                                    sm
                                                                                                ) =>
                                                                                                    sm !==
                                                                                                    member
                                                                                                        ?.user
                                                                                                        ?._id
                                                                                            )
                                                                                        );
                                                                                    }
                                                                                }}
                                                                                id={`member-${member?.user?._id}`}
                                                                            />
                                                                            <span className="truncate flex-1">
                                                                                {member?.user?.name}
                                                                            </span>
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
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    'Create Task'
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
