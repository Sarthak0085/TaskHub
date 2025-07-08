import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { toast } from 'sonner';
import { useUpdateTaskTitleMutation } from '@/hooks/use-task';

export const TaskTitle = ({ title, taskId }: { title: string; taskId: string }) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState(title);

    const { mutate, isPending } = useUpdateTaskTitleMutation();

    const updateTitle = () => {
        mutate(
            { taskId: taskId, title: newTitle },
            {
                onSuccess: () => {
                    setIsEditing(false);
                    toast.success('Title updated successfully');
                },
                onError: (error: any) => {
                    const errorMessage = error.response.data.message;
                    toast.error(errorMessage);
                    console.error('Update Task Title Error :', error);
                },
            }
        );
    };

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsEditing(false);
            }
        }

        if (isEditing) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isEditing, setIsEditing]);

    return (
        <div ref={wrapperRef} className="flex items-center mt-2 gap-4">
            {isEditing ? (
                <Input
                    className="text-xl! font-semibold w-full max-w-[400px]"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    disabled={isPending}
                />
            ) : (
                <h2 className="text-xl flex-1 font-semibold">{title}</h2>
            )}

            {isEditing ? (
                <Button className="py-0" size="sm" onClick={updateTitle} disabled={isPending}>
                    Save
                </Button>
            ) : (
                <Edit className="size-3 cursor-pointer" onClick={() => setIsEditing(true)} />
            )}
        </div>
    );
};
