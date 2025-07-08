import type { Project } from '@/types';
import { NoDataFound } from '@/components/no-data-found';
import { ProjectCard } from './project-card';

interface ProjectListProps {
    workspaceId: string;
    projects: Project[];
    onCreateProject: () => void;
}

export const ProjectList = ({ workspaceId, projects, onCreateProject }: ProjectListProps) => {
    return (
        <div>
            <h2 className="text-xl font-medium mb-4">Projects</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {projects?.length === 0 ? (
                    <NoDataFound
                        title="No projects found"
                        description="Create a project to get started"
                        buttonText="Create Project"
                        buttonAction={onCreateProject}
                    />
                ) : (
                    projects?.map((project) => {
                        const projectProgress =
                            project.tasks.length > 0
                                ? (project?.tasks?.filter((task) => task.status === 'DONE').length /
                                      project?.tasks.length) *
                                  100
                                : 0;
                        return (
                            <ProjectCard
                                key={project?._id}
                                project={project}
                                progress={projectProgress}
                                workspaceId={workspaceId}
                            />
                        );
                    })
                )}
            </div>
        </div>
    );
};
