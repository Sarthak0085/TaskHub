import { Header } from '@/components/dashboard/layout/header';
import { Sidebar } from '@/components/dashboard/layout/sidebar';
import Loader from '@/components/loader';
import { CreateWorkspace } from '@/components/workspace/create-workspace';
import { useGetWorkspacesQuery } from '@/hooks/use-workspace';
import { useAuth } from '@/providers/auth-context';
import type { Workspace } from '@/types';
import { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function DashboardLayout() {
    const { isAuthenticated, isLoading } = useAuth();
    const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);
    const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
    const { data: workspaces, isLoading: workspacesLoading } = useGetWorkspacesQuery() as {
        data: Workspace[];
        isLoading: boolean;
    };

    if (isLoading || workspacesLoading) {
        return <Loader />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/auth/sign-in" />;
    }

    const handleWorkspaceSelected = (workspace: Workspace) => {
        setCurrentWorkspace(workspace);
    };

    return (
        <div className="flex h-screen w-full">
            <Sidebar currentWorkspace={currentWorkspace} />
            {/* Sidebar  */}
            <div className="flex flex-1 flex-col h-full">
                {/* Header */}
                <Header
                    onWorkspaceSelected={handleWorkspaceSelected}
                    selectedWorkspace={currentWorkspace}
                    onCreateWorkspace={() => setIsCreatingWorkspace(true)}
                    workspaces={workspaces}
                />
                <main className="flex-1 overflow-y-auto h-full w-full">
                    <div className="mx-auto container px-2 sm:px-6 lg:px-8 py-0 md:py-8 w-full h-full">
                        <Outlet />
                    </div>
                </main>
            </div>

            <CreateWorkspace
                isCreatingWorkspace={isCreatingWorkspace}
                setIsCreatingWorkspace={setIsCreatingWorkspace}
            />
        </div>
    );
}
