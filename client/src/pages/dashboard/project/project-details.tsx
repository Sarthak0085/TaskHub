import Loader from '@/components/loader';
import { CreateTask } from '@/components/task/create-task';
import { TaskColumn } from '@/components/task/task-column';
import { BackButton } from '@/components/ui/back-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetProjectQuery } from '@/hooks/use-project';
import { getProjectProgress } from '@/lib';
import type { Project, Task, TaskStatus } from '@/types';
import { Settings } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

export default function ProjectDetails() {
    const { projectId, workspaceId } = useParams<{
        projectId: string;
        workspaceId: string;
    }>();

    const navigate = useNavigate();

    const [isCreateTask, setIsCreateTask] = useState(false);
    const [_taskFilter, setTaskFilter] = useState<TaskStatus | 'All'>('All');

    const { data, isLoading } = useGetProjectQuery(projectId!) as {
        data: {
            tasks: Task[];
            project: Project;
        };
        isLoading: boolean;
    };

    if (isLoading) {
        return <Loader />;
    }

    const projectProgress = getProjectProgress(data?.tasks);

    const handleTaskClick = (taskId: string) => {
        navigate(`/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`);
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <BackButton />
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl md:text-2xl font-bold">{data?.project?.title}</h1>
                    </div>
                    {data?.project?.description && (
                        <p className="text-sm text-gray-500">{data?.project?.description}</p>
                    )}
                </div>

                <div className="flex flex-col md:flex-row gap-3">
                    <div className="flex items-center gap-2 min-w-32">
                        <div className="text-sm text-muted-foreground">Progress :</div>
                        <div className="flex-1">
                            <Progress value={projectProgress} className="h-2" />
                        </div>
                        <span className="text-sm text-muted-foreground">{projectProgress} %</span>
                    </div>

                    <div className="flex gap-2">
                        <Button onClick={() => setIsCreateTask(true)}>Add Task</Button>
                        <Link to={`/workspaces/${workspaceId}/projects/${projectId}/settings`}>
                            <Button variant={'ghost'} size={'icon'} title="Project Setting">
                                <Settings className="size-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <Tabs defaultValue="all" className="w-full">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <TabsList>
                            <TabsTrigger value="all" onClick={() => setTaskFilter('All')}>
                                All Tasks
                            </TabsTrigger>
                            <TabsTrigger value="todo" onClick={() => setTaskFilter('TO DO')}>
                                To Do
                            </TabsTrigger>
                            <TabsTrigger
                                value="in-progress"
                                onClick={() => setTaskFilter('IN PROGRESS')}
                            >
                                In Progress
                            </TabsTrigger>
                            <TabsTrigger value="done" onClick={() => setTaskFilter('DONE')}>
                                Done
                            </TabsTrigger>
                        </TabsList>

                        <div className="flex items-center text-sm">
                            <span className="text-muted-foreground mr-2">Status : </span>
                            <div className="space-x-2">
                                <Badge variant={'outline'} className="bg-accent">
                                    {data?.tasks?.filter((task) => task.status === 'TO DO').length}{' '}
                                    To Do
                                </Badge>
                                <Badge variant={'outline'} className="bg-accent">
                                    {
                                        data?.tasks?.filter((task) => task.status === 'IN PROGRESS')
                                            .length
                                    }{' '}
                                    In Progress
                                </Badge>
                                <Badge variant={'outline'} className="bg-accent">
                                    {data?.tasks?.filter((task) => task.status === 'DONE').length}{' '}
                                    Done
                                </Badge>
                            </div>
                        </div>
                    </div>

                    <TabsContent value="all" className="m-0">
                        <div className="grid grid-cols-3 gap-4">
                            <TaskColumn
                                title="To Do"
                                tasks={data?.tasks?.filter((task) => task.status === 'TO DO')}
                                onTaskClick={handleTaskClick}
                            />
                            <TaskColumn
                                title="In Progress"
                                tasks={data?.tasks?.filter((task) => task.status === 'IN PROGRESS')}
                                onTaskClick={handleTaskClick}
                            />
                            <TaskColumn
                                title="Done"
                                tasks={data?.tasks?.filter((task) => task.status === 'DONE')}
                                onTaskClick={handleTaskClick}
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="todo" className="m-0">
                        <div className="grid md:grid-cols-1 gap-4">
                            <TaskColumn
                                title="To Do"
                                tasks={data?.tasks?.filter((task) => task.status === 'TO DO')}
                                onTaskClick={handleTaskClick}
                                isFullWidth
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="in-progress" className="m-0">
                        <div className="grid md:grid-cols-1 gap-4">
                            <TaskColumn
                                title="In Progress"
                                tasks={data?.tasks?.filter((task) => task.status === 'IN PROGRESS')}
                                onTaskClick={handleTaskClick}
                                isFullWidth
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="done" className="m-0">
                        <div className="grid md:grid-cols-1 gap-4">
                            <TaskColumn
                                title="Done"
                                tasks={data?.tasks?.filter((task) => task.status === 'DONE')}
                                onTaskClick={handleTaskClick}
                                isFullWidth
                            />
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            <CreateTask
                open={isCreateTask}
                onOpenChange={setIsCreateTask}
                projectId={projectId!}
                projectMembers={data?.project?.members as any}
            />
        </div>
    );
}
