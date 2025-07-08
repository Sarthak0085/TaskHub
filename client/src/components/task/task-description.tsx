import { useUpdateTaskDescriptionMutation } from '@/hooks/use-task';
import { Edit } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export const TaskDescription = ({
    description,
    taskId,
}: {
    description: string;
    taskId: string;
}) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [newDescription, setNewDescription] = useState(description);
    const { mutate, isPending } = useUpdateTaskDescriptionMutation();
    const updateDescription = () => {
        mutate(
            { taskId, description: newDescription },
            {
                onSuccess: () => {
                    setIsEditing(false);
                    toast.success('Description updated successfully');
                },
                onError: (error: any) => {
                    const errorMessage =
                        error.response.data.message || 'Failed to update description';
                    toast.error(errorMessage);
                    console.error('Update Task description Error :', error);
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
        <div ref={wrapperRef} className="flex items-center gap-2">
            {isEditing ? (
                <Textarea
                    rows={4}
                    className="w-full"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    disabled={isPending}
                />
            ) : (
                <div className="text-sm md:text-base text-pretty flex-1 text-muted-foreground">
                    {description}
                </div>
            )}

            {isEditing ? (
                <Button className="py-0" size="sm" onClick={updateDescription} disabled={isPending}>
                    Save
                </Button>
            ) : (
                <Edit className="size-3 cursor-pointer" onClick={() => setIsEditing(true)} />
            )}
        </div>
    );
};
