import type { Comment, User } from '@/types';
import { useState } from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { useAddCommentMutation, useGetCommentsByTaskId } from '@/hooks/use-task';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import Loader from '../loader';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { formatDistanceToNow } from 'date-fns';

interface CommentSectionProps {
    taskId: string;
    members?: User[];
}

export const CommentSection = ({ taskId }: CommentSectionProps) => {
    const [newComment, setNewComment] = useState('');

    const { mutate, isPending } = useAddCommentMutation();

    const { data, isLoading } = useGetCommentsByTaskId(taskId) as {
        data: {
            comments: Comment[];
        };
        isLoading: boolean;
    };

    const handleAddComment = () => {
        if (!newComment.trim()) return;

        mutate(
            { taskId, text: newComment },
            {
                onSuccess: () => {
                    toast.success('Comment added successfully');
                    setNewComment('');
                },
                onError: (error: any) => {
                    const errorMessage =
                        error?.response?.data?.message || 'Error while creating comment';
                    console.error(error);
                    toast.error(errorMessage);
                },
            }
        );
    };

    return (
        <div className="bg-card rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-medium mb-4">Comments</h3>

            <ScrollArea className="h-[300px] mb-4">
                {isLoading ? (
                    <Loader />
                ) : data?.comments && data?.comments?.length > 0 ? (
                    data?.comments.map((comment) => (
                        <div key={comment?._id} className="flex gap-4 py-2">
                            <Avatar className="size-8">
                                <AvatarImage
                                    src={comment?.author?.profilePicture}
                                    alt={comment?.author?.name}
                                />
                                <AvatarFallback className="bg-blue-400 text-white">
                                    {comment?.author?.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>

                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-medium">
                                        {comment?.author?.name}
                                    </span>

                                    <span className="text-xs text-muted-foreground">
                                        {formatDistanceToNow(comment?.createdAt, {
                                            addSuffix: true,
                                        })}
                                    </span>
                                </div>

                                <p className="text-sm text-muted-foreground">{comment?.text}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex items-center justify-center py-8">
                        <p className="text-sm text-muted-foreground">No comments yet</p>
                    </div>
                )}
            </ScrollArea>

            <Separator className="my-4" />

            <div className="mt-4">
                <Textarea
                    placeholder="Add a comment"
                    value={newComment}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setNewComment(e.target.value)
                    }
                />

                <div className="flex justify-end mt-4">
                    <Button disabled={isPending || !newComment.trim()} onClick={handleAddComment}>
                        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Post'}
                    </Button>
                </div>
            </div>
        </div>
    );
};
