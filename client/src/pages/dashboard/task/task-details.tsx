import { DeleteDialog } from '@/components/delete-dialog';
import Loader from '@/components/loader';
import { CommentSection } from '@/components/task/comment-section';
import { SubTasks } from '@/components/task/sub-task';
import { TaskActivity } from '@/components/task/task-activity';
import { TaskAssigneesSelect } from '@/components/task/task-assignees-select';
import { TaskDescription } from '@/components/task/task-description';
import { TaskPrioritySelect } from '@/components/task/task-priority-select';
import { TaskStatusSelect } from '@/components/task/task-status-select';
import { TaskTitle } from '@/components/task/task-title';
import { Watchers } from '@/components/task/watchers';
import { BackButton } from '@/components/ui/back-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    useDeleteTaskMutation,
    useGetTaskQuery,
    useToggleArchivedTaskMutation,
    useToggleWatchTaskMutation,
} from '@/hooks/use-task';
import { useAuth } from '@/providers/auth-context';
import type { Project, Task } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

export default function TaskDetails() {
    const { user } = useAuth();
    const { taskId } = useParams() as {
        taskId: string;
    };
    const [isOpen, setIsOpen] = useState(false);

    const navigate = useNavigate();

    const { mutate: watchTask, isPending: isWatching } = useToggleWatchTaskMutation();
    const { mutate: archivedTask, isPending: isArchived } = useToggleArchivedTaskMutation();
    const { mutate: deleteTask, isPending: isDeleting } = useDeleteTaskMutation();

    const { data, isLoading } = useGetTaskQuery(taskId) as {
        data: {
            task: Task;
            project: Project;
        };
        isLoading: boolean;
    };

    const handleWatchTask = () => {
        watchTask(
            { taskId: task._id },
            {
                onSuccess: (data: any) => {
                    const isWatching = data?.isWatching;
                    toast.success(isWatching ? 'Task Unwatched' : 'Task Watched');
                },
                onError: (error: any) => {
                    const errorMessage =
                        error?.response?.data?.message || 'Error while watching task';
                    toast.error(errorMessage);
                    console.error('Watching Error :', error);
                },
            }
        );
    };

    const handleArchivedTask = () => {
        archivedTask(
            { taskId: task._id },
            {
                onSuccess: (data: any) => {
                    const isArchived = data?.isArchived;
                    toast.success(isArchived ? 'Task unarchived' : 'Task archived');
                },
                onError: (error: any) => {
                    const errorMessage =
                        error?.response?.data?.message || 'Error while watching task';
                    toast.error(errorMessage);
                    console.error('Achived Error :', error);
                },
            }
        );
    };

    const handleDelete = () => {
        deleteTask(taskId, {
            onSuccess: (data: any) => {
                const message = data?.message || `Task ${data?.title} deleted successfully`;
                toast.success(message);
                setIsOpen(false);
                navigate(-1);
            },
            onError: (error: any) => {
                const errorMessage = error?.response?.data?.message || 'Failed to delete task';
                console.error('Delete Task Error :', error);
                toast.error(errorMessage);
            },
        });
    };

    if (isLoading) {
        return <Loader />;
    }

    if (!data) {
        return (
            <div className="flex items-center justify-center h-screen">
                <h1 className="text-2xl font-bold">Task not found</h1>
            </div>
        );
    }

    const { task, project } = data;
    const isUserWatching = task?.watchers?.some(
        (watcher) => watcher?._id.toString() === user?._id.toString()
    );

    return (
        <div className="container mx-auto p-0 py-4 md:px-4">
            <div className="flex flex-col md:flex-row items-center justify-between mb-4">
                <div className="flex flex-col md:flex-row md:items-center">
                    <BackButton />
                </div>

                <div className="flex space-x-2 mt-4 md:mt-0">
                    <Button
                        variant={'outline'}
                        size="sm"
                        onClick={handleWatchTask}
                        className="w-fit"
                        disabled={isWatching}
                    >
                        {isUserWatching ? (
                            <>
                                <EyeOff className="mr-2 size-4" />
                                Unwatch
                            </>
                        ) : (
                            <>
                                <Eye className="mr-2 size-4" />
                                Watch
                            </>
                        )}
                    </Button>

                    <Button
                        variant={'outline'}
                        size="sm"
                        onClick={handleArchivedTask}
                        className="w-fit"
                        disabled={isArchived}
                    >
                        {task.isArchived ? 'Unarchive' : 'Archive'}
                    </Button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                <div className="w-full lg:min-w-[65%] lg:col-span-2">
                    <div className="bg-card rounded-lg p-3 shadow-sm mb-6">
                        <div className="flex items-center mb-3">
                            <h1 className="text-xl md:text-2xl font-bold">{task.title}</h1>
                            {task?.isArchived && (
                                <Badge variant={'outline'} className="ml-2 mt-1">
                                    Archived
                                </Badge>
                            )}
                        </div>
                        <div className="flex flex-col md:flex-row justify-between items-start mb-4">
                            <div>
                                <Badge
                                    variant={
                                        task?.priority === 'HIGH'
                                            ? 'destructive'
                                            : task.priority === 'MEDIUM'
                                              ? 'default'
                                              : 'outline'
                                    }
                                    className="mb-2 "
                                >
                                    {task.priority === 'HIGH'
                                        ? 'High'
                                        : task?.priority === 'MEDIUM'
                                          ? 'Medium'
                                          : 'Low'}{' '}
                                    Priority
                                </Badge>
                            </div>

                            <div className="flex items-center gap-2 mt-4 md:mt-0">
                                <TaskStatusSelect taskId={taskId} status={task?.status} />

                                <DeleteDialog
                                    buttonText="Delete Task"
                                    description="This action cannot be undone. This will permanently delete the task from our servers"
                                    isOpen={isOpen}
                                    onOpenChange={setIsOpen}
                                    isPending={isDeleting}
                                    handleDelete={handleDelete}
                                />
                            </div>
                        </div>

                        <div>
                            <TaskTitle taskId={task?._id} title={task?.title} />

                            <div className="text-sm md:text-base text-muted-foreground py-2">
                                Created at:{' '}
                                {formatDistanceToNow(new Date(task?.createdAt), {
                                    addSuffix: true,
                                })}
                            </div>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-sm font-medium text-muted-foreground py-2">
                                Description
                            </h3>

                            <TaskDescription
                                description={task?.description || ''}
                                taskId={taskId}
                            />
                        </div>

                        <TaskAssigneesSelect
                            task={task}
                            assignees={task?.assignees!}
                            projectMembers={project?.members}
                        />

                        <TaskPrioritySelect taskId={taskId} priority={task?.priority} />

                        <SubTasks subTasks={task.subtasks || []} taskId={task._id} />
                    </div>

                    <CommentSection taskId={task?._id} members={project?.members as any} />
                </div>
                {/* right side  */}
                <div className="">
                    <Watchers watchers={task?.watchers || []} />

                    <TaskActivity resourceId={task?._id} />
                </div>
            </div>
        </div>
    );
}
