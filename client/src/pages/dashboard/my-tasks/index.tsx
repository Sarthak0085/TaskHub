import Loader from '@/components/loader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetMyTasksQuery } from '@/hooks/use-task';
import type { Task } from '@/types';
import { format } from 'date-fns';
import { ArrowRight, CheckCircle, Clock, FilterIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

export default function MyTasks() {
    const [searchParams, setSearchParams] = useSearchParams();

    const initialFilter = searchParams.get('filter') || 'all';
    const initialSort = searchParams.get('sort') || 'desc';
    const initialSearch = searchParams.get('search') || '';
    const workspaceId = searchParams.get('workspaceId') || '';

    const [filter, setFilter] = useState<string>(initialFilter);
    const [sort, setSort] = useState<'asc' | 'desc'>(initialSort === 'asc' ? 'desc' : 'asc');
    const [search, setSearch] = useState<string>(initialSearch);

    const { data, isLoading } = useGetMyTasksQuery(workspaceId) as {
        data: {
            tasks: Task[];
        };
        isLoading: boolean;
    };

    useEffect(() => {
        const params: Record<string, string> = {};
        searchParams.forEach((value, key) => (params[key] = value));

        params.filter = filter;
        params.sort = sort;
        params.search = search;

        setSearchParams(params, { replace: true });
    }, [filter, sort, search]);

    useEffect(() => {
        const urlFilter = searchParams.get('filter') || 'all';
        const urlSort = searchParams.get('sort') || 'desc';
        const urlSearch = searchParams.get('search') || '';

        if (urlFilter !== filter) setFilter(urlFilter);
        if (urlSort !== sort) setSort(urlSort === 'asc' ? 'asc' : 'desc');
        if (urlSearch !== search) setSearch(urlSearch);
    }, [searchParams]);

    const filteredTasks =
        data?.tasks.length > 0
            ? data?.tasks
                  .filter((task) => {
                      if (filter === 'all') return true;
                      if (filter === 'todo') return task.status === 'TO DO';
                      if (filter === 'inprogress') return task.status === 'IN PROGRESS';
                      if (filter === 'done') return task.status === 'DONE';
                      if (filter === 'archived') return task.isArchived === true;
                      if (filter === 'high') return task.priority === 'HIGH';
                      if (filter === 'medium') return task.priority === 'MEDIUM';
                      if (filter === 'low') return task.priority === 'LOW';

                      return true;
                  })
                  .filter(
                      (task) => (
                          task?.title?.toLowerCase().includes(search.toLowerCase()),
                          task?.description?.toLowerCase().includes(search.toLowerCase())
                      )
                  )
            : [];

    const sortedTasks = [...filteredTasks].sort((a, b) => {
        if (a?.dueDate && b?.dueDate) {
            return sort === 'asc'
                ? new Date(a?.dueDate).getTime() - new Date(b?.dueDate).getTime()
                : new Date(b?.dueDate).getTime() - new Date(a?.dueDate).getTime();
        }

        return 0;
    });

    const todoTasks = sortedTasks?.filter((task) => task?.status === 'TO DO');
    const inProgressTasks = sortedTasks?.filter((task) => task?.status === 'IN PROGRESS');
    const doneTasks = sortedTasks?.filter((task) => task?.status === 'DONE');

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-start md:items-center justify-between">
                <h1 className="text-2xl font-bold">My Tasks</h1>

                <div className="flex flex-col md:flex-row items-center gap-2">
                    <Button
                        variant={'outline'}
                        onClick={() => setSort(sort === 'asc' ? 'desc' : 'asc')}
                    >
                        {sort === 'asc' ? 'Oldest First' : 'Newest First'}
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant={'outline'}>
                                <FilterIcon className="size-4" /> Filter
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent>
                            <DropdownMenuLabel>Filter Tasks</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {[
                                { key: 'all', label: 'All Tasks' },
                                { key: 'todo', label: 'To Do' },
                                { key: 'inprogress', label: 'In Progress' },
                                { key: 'done', label: 'Done' },
                                { key: 'archived', label: 'Archived' },
                                { key: 'high', label: 'High' },
                                { key: 'medium', label: 'Medium' },
                                { key: 'low', label: 'Low' },
                            ].map(({ key, label }) => (
                                <DropdownMenuItem
                                    key={key}
                                    onClick={() => setFilter(key)}
                                    className={
                                        filter === key ? 'bg-muted text-primary font-semibold' : ''
                                    }
                                >
                                    {label}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <Input
                type="text"
                value={search}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                placeholder="Search tasks..."
                className="max-w-xs"
            />

            <Tabs defaultValue="list">
                <TabsList>
                    <TabsTrigger value="list">List View</TabsTrigger>
                    <TabsTrigger value="board">Board View</TabsTrigger>
                </TabsList>

                {/* LIST VIEW  */}
                <TabsContent value="list" className="mb-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>My Tasks</CardTitle>
                            <CardDescription>
                                {sortedTasks?.length} tasks assigned to you
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <div className="divide-y">
                                {sortedTasks?.map((task) => (
                                    <div key={task?._id} className="p-4 hover:bg-muted/50">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                                            <div className="flex">
                                                <div className="flex items-center gap-2 mr-2">
                                                    {task?.status === 'DONE' ? (
                                                        <CheckCircle className="size-4 text-emerald-400" />
                                                    ) : (
                                                        <Clock className="size-4 text-yellow-500" />
                                                    )}
                                                </div>

                                                <div>
                                                    <Link
                                                        to={`/workspaces/${task?.project?.workspace}/projects/${task?.project?._id}/tasks/${task?._id}`}
                                                        className="font-medium hover:text-primary hover:underline flex items-center transition-colors"
                                                    >
                                                        {task?.title}
                                                        <ArrowRight className="size-4 ml-1" />
                                                    </Link>

                                                    <div className="flex items-center space-x-2 mt-1">
                                                        <Badge
                                                            variant={
                                                                task?.status === 'DONE'
                                                                    ? 'success'
                                                                    : 'outline'
                                                            }
                                                        >
                                                            {task?.status}
                                                        </Badge>

                                                        <Badge
                                                            variant={
                                                                task?.priority === 'HIGH'
                                                                    ? 'destructive'
                                                                    : task?.priority === 'MEDIUM'
                                                                      ? 'primary'
                                                                      : 'muted'
                                                            }
                                                        >
                                                            {task?.priority}
                                                        </Badge>

                                                        {task?.isArchived && (
                                                            <Badge variant={'outline'}>
                                                                ARCHIVED
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-sm text-muted-foreground space-y-1">
                                                {task?.dueDate && (
                                                    <div>Due: {format(task?.dueDate, 'PPPP')}</div>
                                                )}

                                                <div>
                                                    Project:{' '}
                                                    <span className="font-medium">
                                                        {task?.project?.title}
                                                    </span>
                                                </div>

                                                <div>
                                                    Modified on: {format(task?.updatedAt, 'PPPP')}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {sortedTasks?.length === 0 && (
                                    <div className="p-4 text-center text-sm text-muted-foreground">
                                        No tasks found
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* BOARD VIEW  */}
                <TabsContent value="board" className="mb-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* TO DO  */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    To Do
                                    <Badge variant={'outline'}>{todoTasks?.length}</Badge>
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="p-2 space-y-3 max-h-[600px] overflow-y-auto">
                                {todoTasks?.map((task) => (
                                    <Card
                                        key={task?._id}
                                        className="hover:shadow-md transition-shadow p-2"
                                    >
                                        <Link
                                            to={`/workspaces/${task?.project?.workspace}/projects/${task?.project?._id}/tasks/${task?._id}`}
                                            className="block"
                                        >
                                            <h3 className="font-medium">{task?.title}</h3>
                                            <p className="text-sm text-muted-foregorund line-clamp-3">
                                                {task?.description || 'No description'}
                                            </p>

                                            <div className="flex items-center gap-2 mt-2">
                                                <Badge
                                                    variant={
                                                        task?.priority === 'HIGH'
                                                            ? 'destructive'
                                                            : task?.priority === 'MEDIUM'
                                                              ? 'primary'
                                                              : 'muted'
                                                    }
                                                >
                                                    {task?.priority}
                                                </Badge>

                                                {task?.isArchived && (
                                                    <Badge variant={'outline'}>ARCHIVED</Badge>
                                                )}
                                            </div>

                                            <div className="pt-2">
                                                {task?.dueDate && (
                                                    <div className="text-xs text-muted-foreground">
                                                        {format(task?.dueDate, 'PPPP')}
                                                    </div>
                                                )}
                                            </div>
                                        </Link>
                                    </Card>
                                ))}

                                {todoTasks?.length === 0 && (
                                    <div className="p-4 text-center text-sm text-muted-foreground">
                                        No tasks found
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* IN PROGRESS  */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    In Progress
                                    <Badge variant={'outline'}>{inProgressTasks?.length}</Badge>
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="p-2 space-y-3 max-h-[600px] overflow-y-auto">
                                {inProgressTasks?.map((task) => (
                                    <Card
                                        key={task?._id}
                                        className="hover:shadow-md transition-shadow p-2"
                                    >
                                        <Link
                                            to={`/workspaces/${task?.project?.workspace}/projects/${task?.project?._id}/tasks/${task?._id}`}
                                            className="block"
                                        >
                                            <h3 className="font-medium">{task?.title}</h3>
                                            <p className="text-sm text-muted-foregorund line-clamp-3">
                                                {task?.description || 'No description'}
                                            </p>

                                            <div className="flex items-center gap-2 mt-2">
                                                <Badge
                                                    variant={
                                                        task?.priority === 'HIGH'
                                                            ? 'destructive'
                                                            : task?.priority === 'MEDIUM'
                                                              ? 'primary'
                                                              : 'muted'
                                                    }
                                                >
                                                    {task?.priority}
                                                </Badge>

                                                {task?.isArchived && (
                                                    <Badge variant={'outline'}>ARCHIVED</Badge>
                                                )}
                                            </div>

                                            <div className="pt-2">
                                                {task?.dueDate && (
                                                    <div className="text-xs text-muted-foreground">
                                                        {format(task?.dueDate, 'PPPP')}
                                                    </div>
                                                )}
                                            </div>
                                        </Link>
                                    </Card>
                                ))}

                                {inProgressTasks?.length === 0 && (
                                    <div className="p-4 text-center text-sm text-muted-foreground">
                                        No tasks found
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* DONE */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    Done
                                    <Badge variant={'outline'}>{doneTasks?.length}</Badge>
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="p-3 space-y-3 max-h-[600px] overflow-y-auto">
                                {doneTasks?.map((task) => (
                                    <Card
                                        key={task?._id}
                                        className="hover:shadow-md transition-shadow p-2"
                                    >
                                        <Link
                                            to={`/workspaces/${task?.project?.workspace}/projects/${task?.project?._id}/tasks/${task?._id}`}
                                            className="block"
                                        >
                                            <h3 className="font-medium">{task?.title}</h3>
                                            <p className="text-sm text-muted-foregorund line-clamp-3">
                                                {task?.description || 'No description'}
                                            </p>

                                            <div className="flex items-center gap-2 mt-2">
                                                <Badge
                                                    variant={
                                                        task?.priority === 'HIGH'
                                                            ? 'destructive'
                                                            : task?.priority === 'MEDIUM'
                                                              ? 'primary'
                                                              : 'muted'
                                                    }
                                                >
                                                    {task?.priority}
                                                </Badge>

                                                {task?.isArchived && (
                                                    <Badge variant={'outline'}>ARCHIVED</Badge>
                                                )}
                                            </div>

                                            <div className="pt-2">
                                                {task?.dueDate && (
                                                    <div className="text-xs text-muted-foreground">
                                                        {format(task?.dueDate, 'PPPP')}
                                                    </div>
                                                )}
                                            </div>
                                        </Link>
                                    </Card>
                                ))}

                                {doneTasks?.length === 0 && (
                                    <div className="p-4 text-center text-sm text-muted-foreground">
                                        No tasks found
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
