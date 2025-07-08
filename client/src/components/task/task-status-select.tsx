import type { TaskStatus } from '@/types';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useUpdateTaskStatusMutation } from '@/hooks/use-task';
import { toast } from 'sonner';

export const TaskStatusSelect = ({ status, taskId }: { status: TaskStatus; taskId: string }) => {
    const { mutate, isPending } = useUpdateTaskStatusMutation();

    const handleStatusChange = (value: TaskStatus) => {
        mutate(
            { taskId, status: value as TaskStatus },
            {
                onSuccess: () => {
                    toast.success('Status updated successfully');
                },
                onError: (error: any) => {
                    const errorMessage = error.response.data.message;
                    toast.error(errorMessage);
                    console.error('Update Task Status Error :', error);
                },
            }
        );
    };
    return (
        <Select value={status || ''} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[180px]" disabled={isPending}>
                <SelectValue placeholder="Status" />
            </SelectTrigger>

            <SelectContent>
                <SelectItem value="TO DO">To Do</SelectItem>
                <SelectItem value="IN PROGRESS">In Progress</SelectItem>
                <SelectItem value="DONE">Done</SelectItem>
            </SelectContent>
        </Select>
    );
};
