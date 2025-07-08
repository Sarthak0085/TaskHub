import Loader from '@/components/loader';
import { CreateProject } from '@/components/project/create-project';
import { ProjectList } from '@/components/project/project-list';
import { InviteMember } from '@/components/workspace/invite-member';
import { WorkspaceHeader } from '@/components/workspace/workspace-header';
import { useGetWorkspaceQuery } from '@/hooks/use-workspace';
import type { Project, Workspace } from '@/types';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

export default function WorkspaceDetails() {
    const { workspaceId } = useParams<{ workspaceId: string }>();
    const [isCreateProject, setIsCreateProject] = useState<boolean>(false);
    const [isInviteMember, setIsInviteMember] = useState<boolean>(false);

    const { data, isLoading } = useGetWorkspaceQuery(workspaceId as string) as {
        data: {
            workspace: Workspace;
            projects: Project[];
        };
        isLoading: boolean;
    };

    if (!workspaceId) {
        return <div>No Workspace found</div>;
    }

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className="space-y-8">
            <WorkspaceHeader
                workspace={data?.workspace}
                members={data?.workspace?.members}
                onCreateProject={() => setIsCreateProject(true)}
                onInviteMember={() => setIsInviteMember(true)}
            />

            <ProjectList
                projects={data?.projects}
                onCreateProject={() => setIsCreateProject(true)}
                workspaceId={workspaceId}
            />

            <CreateProject
                workspaceId={workspaceId}
                isOpen={isCreateProject}
                onOpenChange={setIsCreateProject}
                workspaceMembers={data?.workspace?.members}
            />

            <InviteMember
                workspaceId={workspaceId}
                isOpen={isInviteMember}
                onOpenChange={setIsInviteMember}
            />
        </div>
    );
}
