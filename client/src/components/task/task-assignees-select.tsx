import type { ProjectMemberRole, Task, User } from '@/types';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useUpdateTaskAssigneesMutation } from '@/hooks/use-task';
import { toast } from 'sonner';

interface TaskAssigneesSelectProps {
    task: Task;
    assignees: User[];
    projectMembers: { user: User; role: ProjectMemberRole }[];
}

export const TaskAssigneesSelect = ({
    task,
    assignees,
    projectMembers,
}: TaskAssigneesSelectProps) => {
    const [selectedIDs, setSelectedIDs] = useState<string[]>(
        assignees.map((assignee) => assignee?._id)
    );
    const [dropDownOpen, setDropDownOpen] = useState<boolean>(false);

    const { mutate, isPending } = useUpdateTaskAssigneesMutation();

    const handleSelectAll = () => {
        const allIds = projectMembers.map((m) => m.user._id);
        setSelectedIDs(allIds);
    };

    const handleUnselectAll = () => {
        setSelectedIDs([]);
    };

    const handleSelect = (id: string) => {
        let newSelected: string[] = [];

        if (selectedIDs.includes(id)) {
            newSelected = selectedIDs.filter((selectId) => selectId !== id);
        } else {
            newSelected = [...selectedIDs, id];
        }

        setSelectedIDs(newSelected);
    };

    const handleSave = () => {
        mutate(
            { taskId: task?._id, assignees: selectedIDs },
            {
                onSuccess: () => {
                    toast.success('Assignees updated successfully');
                    setDropDownOpen(false);
                },
                onError: (error: any) => {
                    const errorMessage =
                        error.response?.data?.message || 'Failed to update assignees';
                    toast.error(errorMessage);
                    console.error('Update Assignee Error :', error);
                },
            }
        );
    };

    return (
        <div className="mb-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Assignees</h3>

            <div className="flex flex-wrap gap-2 mb-2">
                {selectedIDs.length === 0 ? (
                    <span className="text-xs text-muted-foreground">Unassigned</span>
                ) : (
                    projectMembers
                        .filter((member) => selectedIDs.includes(member.user._id))
                        .map((member) => (
                            <div
                                key={member?.user?._id}
                                className="flex items-center bg-gray-100 rounded px-2 py-1"
                            >
                                <Avatar className="size-6 mr-1">
                                    <AvatarImage
                                        src={member?.user?.profilePicture}
                                        alt={member?.user?.name}
                                    />
                                    <AvatarFallback className="bg-blue-400 text-white">
                                        {member?.user?.name?.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="text-xs text-muted-foreground">
                                    {member?.user?.name}
                                </span>
                            </div>
                        ))
                )}
            </div>

            {/* dropdown */}
            <div className="relative">
                <button
                    className="text-sm text-muted-foreground w-full border rounded px-3 py-2 text-left bg-white"
                    onClick={() => setDropDownOpen(!dropDownOpen)}
                >
                    {selectedIDs.length === 0
                        ? 'Select assignees'
                        : `${selectedIDs.length} selected`}
                </button>

                {dropDownOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow-lg max-h-60 overflow-y-auto">
                        <div className="flex justify-between px-2 py-1 border-b">
                            <button
                                className="text-sm font-bold text-blue-600"
                                onClick={handleSelectAll}
                            >
                                Select all
                            </button>
                            <button
                                className="text-sm font-bold text-red-600"
                                onClick={handleUnselectAll}
                            >
                                Unselect all
                            </button>
                        </div>

                        {projectMembers.map((mem) => (
                            <label
                                className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-50"
                                key={mem?.user?._id}
                            >
                                <Checkbox
                                    checked={selectedIDs.includes(mem?.user?._id)}
                                    onCheckedChange={() => handleSelect(mem?.user?._id)}
                                    className="mr-2"
                                />

                                <Avatar className="size-6 mr-1">
                                    <AvatarImage
                                        src={mem?.user?.profilePicture}
                                        alt={mem?.user?.name}
                                    />
                                    <AvatarFallback className="bg-blue-400 text-white">
                                        {mem?.user?.name?.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>

                                <span>{mem?.user?.name}</span>
                            </label>
                        ))}

                        <div className="flex justify-between px-2 py-1">
                            <Button
                                variant={'outline'}
                                size={'sm'}
                                className="font-light"
                                onClickCapture={() => setDropDownOpen(false)}
                                disabled={isPending}
                            >
                                Cancel
                            </Button>
                            <Button
                                size={'sm'}
                                className="font-light"
                                disabled={isPending}
                                onClickCapture={() => handleSave()}
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
