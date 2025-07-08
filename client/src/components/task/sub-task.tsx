import { useAddSubtaskMutation, useUpdateSubtaskMutation } from '@/hooks/use-task';
import type { Subtask } from '@/types';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Checkbox } from '../ui/checkbox';
import { cn } from '@/lib/utils';

interface SubTaskProps {
    taskId: string;
    subTasks: Subtask[];
}

export const SubTasks = ({ taskId, subTasks }: SubTaskProps) => {
    const [newSubTask, setNewSubTask] = useState<string>('');

    const { mutate: addSubTask, isPending: isCreating } = useAddSubtaskMutation();
    const { mutate: updateSubtask, isPending: isUpdating } = useUpdateSubtaskMutation();

    const handleToggleTask = (subTaskId: string, checked: boolean) => {
        updateSubtask(
            { taskId, subtaskId: subTaskId, completed: checked },
            {
                onSuccess: () => {
                    toast.success('Sub task updated successfully');
                },
                onError: (error: any) => {
                    const errorMessage =
                        error.response.data.message || 'Error while updating subtasks';
                    console.error('Update Subtask Error :', error);
                    toast.error(errorMessage);
                },
            }
        );
    };

    const handleAddSubTask = () => {
        addSubTask(
            { taskId, title: newSubTask },
            {
                onSuccess: () => {
                    setNewSubTask('');
                    toast.success('Sub task added successfully');
                },
                onError: (error: any) => {
                    const errorMessage =
                        error.response.data.message || 'Error while creating subtask';
                    console.error('Add Subtask Error :', error);
                    toast.error(errorMessage);
                },
            }
        );
    };

    return (
        <div className="my-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-0">Sub Tasks</h3>

            <div className="space-y-2 mb-4 mt-1">
                {subTasks.length > 0 ? (
                    subTasks.map((subTask) => (
                        <div key={subTask._id} className="flex items-center space-x-2">
                            <Checkbox
                                id={subTask._id}
                                checked={subTask.completed}
                                onCheckedChange={(checked) =>
                                    handleToggleTask(subTask?._id, !!checked)
                                }
                                disabled={isUpdating}
                            />

                            <label
                                className={cn(
                                    'text-sm',
                                    subTask?.completed ? 'line-through text-muted-foreground' : ''
                                )}
                            >
                                {subTask?.title}
                            </label>
                        </div>
                    ))
                ) : (
                    <div className="text-sm text-muted-foreground">No sub tasks</div>
                )}
            </div>

            <div className="flex">
                <Input
                    placeholder="Add a sub task"
                    value={newSubTask}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewSubTask(e.target.value)
                    }
                    className="mr-1"
                    disabled={isCreating}
                />

                <Button onClick={handleAddSubTask} disabled={isCreating || newSubTask.length === 0}>
                    Add
                </Button>
            </div>
        </div>
    );
};
