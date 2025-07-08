import type { Workspace } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../ui/dialog';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Circle } from 'lucide-react';
import { useAuth } from '@/providers/auth-context';
import { cn } from '@/lib/utils';
import { useChangeOwnershipMutation } from '@/hooks/use-workspace';
import { toast } from 'sonner';

interface ChangeOwnershipProps {
    workspaceId: string;
    workspace: Workspace;
}

export const ChangeOwnership = ({ workspaceId, workspace }: ChangeOwnershipProps) => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selectedMember, setSelectedMember] = useState(
        workspace?.members.find((member) => member?.user?._id === user?._id)
    );

    const { mutate, isPending } = useChangeOwnershipMutation();

    const handleTransferOwnership = () => {
        mutate(
            { workspaceId, values: { userId: selectedMember?.user?._id, role: 'OWNER' } },
            {
                onSuccess: (data: any) => {
                    const message = data?.message || 'Transfer workspace ownership successfully';
                    setIsOpen(false);
                    toast.success(message);
                },
                onError: (error: any) => {
                    const errorMessage =
                        error?.response?.data?.message || 'Failed to transfer workspace ownership';
                    console.error('Transfer Workspace Ownership Error :', error);
                    toast.error(errorMessage);
                },
            }
        );
    };

    return (
        <Card className="w-full mb-6 max-w-[500px]">
            <CardHeader>
                <CardTitle className="text-md font-semibold">Transfer Workspace</CardTitle>
                <CardDescription className="text-muted-foreground text-sm">
                    Transfer Ownership of this workspace to another member
                </CardDescription>
            </CardHeader>

            <CardContent>
                <Dialog defaultOpen={isOpen} open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button variant={'outline'} className="max-w-fit">
                            Transfer Ownership
                        </Button>
                    </DialogTrigger>

                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Transfer Workspace Ownership</DialogTitle>
                            <DialogDescription>
                                Select a member to transfer ownership of this workspace. This action
                                cannot be undone.
                            </DialogDescription>
                        </DialogHeader>

                        {/* <DialogContent> */}
                        {workspace?.members.map((member) => (
                            <div
                                key={member?.user?._id}
                                onClick={() => setSelectedMember(member)}
                                className={cn(
                                    'w-full flex items-center justify-between p-2 rounded-md cursor-pointer',
                                    selectedMember === member &&
                                        'border-2 border-blue-500 bg-blue-50'
                                )}
                            >
                                <div className="flex items-center gap-2">
                                    <Avatar className="size-8">
                                        <AvatarImage
                                            src={member?.user?.profilePicture}
                                            alt={member?.user?.name}
                                        />
                                        <AvatarFallback className="bg-blue-400 text-white">
                                            {member?.user?.name.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="pb-1">
                                        <h4 className="text-md">{member?.user?.name}</h4>
                                        <p className="text-muted-foreground">
                                            {member?.user?.email}
                                        </p>
                                    </div>
                                </div>
                                <Circle
                                    className={cn(
                                        'size-4',
                                        selectedMember === member && 'fill-blue-500 text-blue-500'
                                    )}
                                />
                            </div>
                        ))}
                        {/* </DialogContent> */}
                        <DialogFooter className="flex items-end gap-2">
                            <DialogClose asChild>
                                <Button
                                    variant={'outline'}
                                    className="max-w-fit"
                                    disabled={isPending}
                                >
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button
                                variant={'destructive'}
                                onClick={handleTransferOwnership}
                                className="max-w-fit"
                                disabled={isPending}
                            >
                                {isPending ? 'Transferring...' : 'Transfer'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    );
};
