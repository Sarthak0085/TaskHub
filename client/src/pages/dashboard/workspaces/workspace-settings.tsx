import Loader from '@/components/loader';
import { ChangeOwnership } from '@/components/workspace/change-ownership';
import { DeleteWorkspace } from '@/components/workspace/delete-workspace';
import { UpdateWorkspace } from '@/components/workspace/update-workspace';
import { useGetWorkspaceDetailsQuery } from '@/hooks/use-workspace';
import type { Workspace } from '@/types';
import { LayoutGrid } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

export default function WorkspaceSettings() {
    const [searchParams] = useSearchParams();

    const workspaceId = searchParams.get('workspaceId');

    const { data, isLoading } = useGetWorkspaceDetailsQuery(workspaceId!) as {
        data: {
            workspace: Workspace;
        };
        isLoading: boolean;
    };

    if (!workspaceId) {
        return (
            <div className="flex flex-col items-center justify-center w-full h-full">
                <LayoutGrid className="size-12 mx-auto text-muted-foreground" />
                <h1 className="text-2xl font-bold">No workspace selected</h1>
                <p className="text-md text-muted-foreground">
                    Please select the workspace to see settings of that workspace.
                </p>
            </div>
        );
    }

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className="w-full flex flex-col items-center justify-center">
            {/* Update Workspace  */}
            <UpdateWorkspace workspaceId={workspaceId!} workspace={data?.workspace} />

            {/* Change Ownership  */}
            <ChangeOwnership workspaceId={workspaceId} workspace={data?.workspace} />

            {/* Delete Workspace  */}
            <DeleteWorkspace workspaceId={workspaceId} />
        </div>
    );
}
