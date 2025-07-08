import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

interface DeleteDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    handleDelete: () => void;
    buttonText: string;
    title?: string;
    description: string;
    isPending: boolean;
}

export const DeleteDialog = ({
    isOpen,
    onOpenChange,
    buttonText,
    title,
    description,
    handleDelete,
    isPending,
}: DeleteDialogProps) => {
    return (
        <Dialog defaultOpen={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button variant={'destructive'} className="w-fit">
                    {buttonText}
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-destructive">{title}</DialogTitle>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                        {description}
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="flex gap-2 items-end">
                    <DialogClose asChild>
                        <Button variant={'outline'} className="w-fit" disabled={isPending}>
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        variant={'destructive'}
                        className="w-fit"
                        onClick={handleDelete}
                        disabled={isPending}
                    >
                        {isPending ? (
                            <div className="flex gap-2 items-center justify-center">
                                <Loader2 className="size-4 animate-spin" />
                                <span className="text-center">deleting...</span>
                            </div>
                        ) : (
                            'Delete'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
