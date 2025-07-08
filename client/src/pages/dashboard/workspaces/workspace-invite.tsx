import Loader from '@/components/loader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WorkspaceAvatar } from '@/components/workspace/workspace-avatar';
import {
    useAcceptGenerateInviteMutation,
    useAcceptInvitationTokenMutation,
    useGetWorkspaceDetailsQuery,
} from '@/hooks/use-workspace';
import type { Workspace } from '@/types';
import { Loader2 } from 'lucide-react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

export default function WorkspaceInvite() {
    const { workspaceId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get('tk');

    const { data, isLoading } = useGetWorkspaceDetailsQuery(workspaceId!) as {
        data: {
            workspace: Workspace;
        };
        isLoading: boolean;
    };

    const { mutate: acceptGenerateInvite, isPending: isAcceptGenerateInvitePending } =
        useAcceptGenerateInviteMutation();

    const { mutate: acceptInviteByToken, isPending: isAcceptInviteByTokenPending } =
        useAcceptInvitationTokenMutation();

    const handleAcceptInvite = () => {
        if (!workspaceId) return;

        if (token) {
            acceptInviteByToken(token, {
                onSuccess: (data: any) => {
                    const message = data?.message || 'Invitation accepted';
                    toast.success(message);
                    navigate(`/workspaces/${workspaceId}`);
                },
                onError: (error: any) => {
                    const errorMessage =
                        error?.response?.data?.message || 'Error while accept invite by token';
                    console.error('Accept Invite Token error :', errorMessage);
                    toast.error(errorMessage);
                },
            });
        } else {
            acceptGenerateInvite(workspaceId, {
                onSuccess: (data: any) => {
                    console.log('accept generate data ', data);
                    const message = data?.message || 'Invitation accepted';
                    toast.success(message);
                    navigate(`/workspaces/${workspaceId}`);
                },
                onError: (error: any) => {
                    const errorMessage =
                        error?.response?.data?.message || 'Error while generate accept invite';
                    console.error('Accept Invite Token error :', errorMessage);
                    toast.error(errorMessage);
                },
            });
        }
    };

    const handleDeclineInvite = () => {
        toast.info('Invitation Decline');
        navigate('/workspaces');
    };

    if (isLoading) {
        return <Loader />;
    }

    if (!data?.workspace) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Card className="w-full sm:min-w-md">
                    <CardHeader>
                        <CardTitle className="text-red-500 font-semibold">
                            Invalid Invitation
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">
                            This workspace invitation is invalid or has expired.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={() => navigate('/workspaces')} className="w-full">
                            Go to Workspaces
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center h-screen">
            <Card className="max-w-md w-full">
                <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <WorkspaceAvatar
                            name={data?.workspace?.name}
                            color={data?.workspace?.color}
                        />
                        <CardTitle>{data?.workspace?.name}</CardTitle>
                    </div>
                    <CardDescription>
                        You've invited to join the "<strong>{data?.workspace?.name}</strong>"
                        workspace
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    {data?.workspace?.description && (
                        <p className="text-sm text-muted-foreground">
                            {data?.workspace?.description}
                        </p>
                    )}
                    <div className="flex gap-3">
                        <Button
                            className="flex-1"
                            onClick={handleAcceptInvite}
                            disabled={isAcceptInviteByTokenPending || isAcceptGenerateInvitePending}
                        >
                            {isAcceptGenerateInvitePending || isAcceptInviteByTokenPending ? (
                                <Loader2 className="size-4 animate-spin" />
                            ) : (
                                'Accept Invitation'
                            )}
                        </Button>
                        <Button
                            variant={'destructive'}
                            className="flex-1"
                            onClick={handleDeclineInvite}
                            disabled={isAcceptInviteByTokenPending || isAcceptGenerateInvitePending}
                        >
                            Decline
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
