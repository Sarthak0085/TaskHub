import { useUpdateTaskStatusMutation } from '@/hooks/use-task';
import type { Task } from '@/types';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AlertCircle, CalendarIcon, CheckCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';

export const TaskCard = ({ task, onClick }: { task: Task; onClick: () => void }) => {
    const { mutate, isPending } = useUpdateTaskStatusMutation();

    const handleTaskClick = (taskStatus: string) => {
        mutate(
            {
                taskId: task?._id,
                status:
                    taskStatus === 'TO DO'
                        ? 'TO DO'
                        : taskStatus === 'DONE'
                          ? 'DONE'
                          : 'IN PROGRESS',
            },
            {
                onSuccess: () => {
                    toast.success('Status updated successfully');
                },
                onError: (error: any) => {
                    const errorMessage =
                        error?.response?.data?.message || 'Error while updating status';
                    console.error('Update Task Status Error :', error);
                    toast.error(errorMessage);
                },
            }
        );
    };
    return (
        <Card
            onClick={onClick}
            className="transition-all duration-300 hover:shadow-md hover:translate-y-1 cursor-pointer"
        >
            <CardHeader>
                <div className="flex items-center justify-between">
                    <Badge
                        className={
                            task?.priority === 'HIGH'
                                ? 'bg-red-500 text-white'
                                : task?.priority === 'MEDIUM'
                                  ? 'bg-orange-500 text-white'
                                  : 'bg-slate-500 text-white'
                        }
                    >
                        {task?.priority}
                    </Badge>

                    <div className="flex gap-1">
                        {task?.status !== 'TO DO' && (
                            <Button
                                variant={'ghost'}
                                size={'icon'}
                                className="size-6"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    handleTaskClick('TO DO');
                                }}
                                title="Mark as To Do"
                                disabled={isPending}
                            >
                                <AlertCircle className="size-4" />
                                <span className="sr-only">Mark as To Do</span>
                            </Button>
                        )}
                        {task?.status !== 'IN PROGRESS' && (
                            <Button
                                variant={'ghost'}
                                size={'icon'}
                                className="size-6"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    handleTaskClick('IN PROGRESS');
                                }}
                                title="Mark as In Progress"
                                disabled={isPending}
                            >
                                <Clock className="size-4" />
                                <span className="sr-only">Mark as In Progress</span>
                            </Button>
                        )}
                        {task?.status !== 'DONE' && (
                            <Button
                                variant={'ghost'}
                                size={'icon'}
                                className="size-6"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    handleTaskClick('DONE');
                                }}
                                title="Mark as Done"
                                disabled={isPending}
                            >
                                <CheckCircle className="size-4" />
                                <span className="sr-only">Mark as Done</span>
                            </Button>
                        )}
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <h4 className="font-medium mb-2">{task?.title}</h4>

                {task?.description && (
                    <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
                        {task?.description}
                    </p>
                )}

                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                        {task?.assignees && task?.assignees?.length > 0 && (
                            <div className="flex -space-x-2">
                                {task?.assignees?.slice(0, 5).map((assignee) => (
                                    <Avatar
                                        key={assignee?._id}
                                        className="relative size-8 border-2 border-background rounded-full bg-gray-700overflow-hidden"
                                        title={assignee?.name}
                                    >
                                        <AvatarImage
                                            src={assignee?.profilePicture}
                                            alt={assignee?.name}
                                        />
                                        <AvatarFallback className="bg-blue-500 text-white">
                                            {assignee?.name?.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                ))}

                                {task?.assignees?.length > 5 && (
                                    <span className="text-muted-foreground">
                                        + {task?.assignees?.length - 5}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    {task?.dueDate && (
                        <div className="text-xs flex items-center text-muted-foregorund">
                            <CalendarIcon className="size-3 mr-1" />
                            {format(task?.dueDate, 'MMM d, yyyy')}
                        </div>
                    )}
                </div>

                {task?.subtasks && task?.subtasks?.length > 0 && (
                    <div className="text-xs mt-2 text-muted-foregorund">
                        {task?.subtasks?.filter((subtask) => subtask.completed).length} /
                        {task?.subtasks?.length}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
