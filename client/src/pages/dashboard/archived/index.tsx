import Loader from '@/components/loader';
import { ProjectCard } from '@/components/project/project-card';
import { TaskCard } from '@/components/task/task-card';
import { Button } from '@/components/ui/button';
import { useGetArchivedDataQuery } from '@/hooks/use-workspace';
import type { Project, Task } from '@/types';
import { ArrowLeft, LayoutGrid } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function Archived() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const workspaceId = searchParams.get('workspaceId');

    const { data, isLoading } = useGetArchivedDataQuery(workspaceId!) as {
        data: {
            archivedProjects: Project[];
            archivedTasks: Task[];
        };
        isLoading: boolean;
    };

    if (!workspaceId) {
        return (
            <div className="flex flex-col items-center justify-center w-full h-full">
                <LayoutGrid className="size-12 mx-auto text-muted-foreground" />
                <h1 className="text-2xl font-bold">No workspace selected</h1>
                <p className="text-md text-muted-foreground max-w-md text-center">
                    Please select the workspace to see archived projects and tasks for that specific
                    workspace
                </p>
            </div>
        );
    }

    if (isLoading) {
        return <Loader />;
    }

    if (data.archivedProjects.length === 0 && data.archivedTasks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center w-full h-full">
                <LayoutGrid className="size-12 mx-auto text-muted-foreground" />
                <h1 className="text-2xl font-bold">No archive items found</h1>
                <p className="text-md text-muted-foreground text-center pb-4 max-w-md">
                    You can archive projects and tasks to keep them out of your way. You can also
                    restore them anytime.
                </p>
                <Button
                    variant={'default'}
                    onClick={() => navigate('/dashboard')}
                    className="max-w-fit flex gap-2 items-center"
                >
                    <ArrowLeft className="size-4" /> Go Back
                </Button>
            </div>
        );
    }

    const handleTaskClick = (task: Task) => {
        navigate(`/workspaces/${workspaceId}/projects/${task?.project}/tasks/${task?._id}`);
    };

    return (
        <div className="space-y-12">
            {data?.archivedProjects.length > 0 && (
                <div className="space-y-6">
                    <div className="flex items-start md:items-center justify-between">
                        <h1 className="text-2xl font-bold">Archived Projects</h1>
                    </div>

                    {
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {data?.archivedProjects.map((project) => {
                                const projectProgress =
                                    project.tasks.length > 0
                                        ? (project?.tasks?.filter((task) => task.status === 'DONE')
                                              .length /
                                              project?.tasks.length) *
                                          100
                                        : 0;
                                return (
                                    <ProjectCard
                                        key={project?._id}
                                        workspaceId={workspaceId}
                                        progress={projectProgress}
                                        project={project}
                                    />
                                );
                            })}
                        </div>
                    }
                </div>
            )}

            {data?.archivedTasks.length > 0 && (
                <div className="space-y-6">
                    <div className="flex items-start md:items-center justify-between">
                        <h1 className="text-2xl font-bold">Archived Tasks</h1>
                    </div>

                    {
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {data?.archivedTasks.map((task) => {
                                return (
                                    <TaskCard
                                        key={task?._id}
                                        task={task}
                                        onClick={() => handleTaskClick(task)}
                                    />
                                );
                            })}
                        </div>
                    }
                </div>
            )}
        </div>
    );
}
