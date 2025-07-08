import type { TaskPriority } from '@/types';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useUpdateTaskPriorityMutation } from '@/hooks/use-task';
import { toast } from 'sonner';

export const TaskPrioritySelect = ({
    priority,
    taskId,
}: {
    priority: TaskPriority;
    taskId: string;
}) => {
    const { mutate, isPending } = useUpdateTaskPriorityMutation();

    const handleStatusChange = (value: TaskPriority) => {
        mutate(
            { taskId, priority: value as TaskPriority },
            {
                onSuccess: () => {
                    toast.success('Priority updated successfully');
                },
                onError: (error: any) => {
                    const errorMessage = error.response.data.message;
                    toast.error(errorMessage);
                    console.error('Update Task Priority Error :', error);
                },
            }
        );
    };
    return (
        <Select value={priority || ''} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[180px]" disabled={isPending}>
                <SelectValue placeholder="Priority" />
            </SelectTrigger>

            <SelectContent>
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
            </SelectContent>
        </Select>
    );
};
