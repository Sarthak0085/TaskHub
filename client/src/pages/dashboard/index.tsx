import { RecentProjects } from '@/components/dashboard/recent-project';
import { StatisticsCharts } from '@/components/dashboard/statistics-charts';
import { StatsCard } from '@/components/dashboard/stats-card';
import { UpcomingTasks } from '@/components/dashboard/upcoming-tasks';
import Loader from '@/components/loader';
import { useGetWorkspaceStatsQuery } from '@/hooks/use-workspace';
import type {
    Project,
    ProjectStatusData,
    StatsCardProps,
    Task,
    TaskPriorityData,
    TaskTrendsData,
    WorkspaceProductivityData,
} from '@/types';
import { LayoutGrid } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

export default function Dashboard() {
    const [searchParams] = useSearchParams();
    const workspaceId = searchParams.get('workspaceId');
    const { data, isLoading } = useGetWorkspaceStatsQuery(workspaceId!) as {
        data: {
            stats: StatsCardProps;
            taskTrendsData: TaskTrendsData[];
            taskPriorityData: TaskPriorityData[];
            projectStatusData: ProjectStatusData[];
            workspaceProductivityData: WorkspaceProductivityData[];
            upcomingTasks: Task[];
            recentProjects: Project[];
        };
        isLoading: boolean;
    };

    if (!workspaceId) {
        return (
            <div className="flex flex-col items-center justify-center w-full h-full">
                <LayoutGrid className="size-12 mx-auto text-muted-foreground" />
                <h1 className="text-2xl font-bold">No workspace selected</h1>
                <p className="text-md text-muted-foreground">
                    Please select the workspace to see members
                </p>
            </div>
        );
    }

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className="space-y-8 2xl:space-y-12">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Dashboard</h1>
            </div>

            <StatsCard data={data?.stats} />

            <StatisticsCharts
                stats={data?.stats}
                taskTrendsData={data?.taskTrendsData}
                projectStatusData={data?.projectStatusData}
                taskPriorityData={data?.taskPriorityData}
                workspaceProductivityData={data?.workspaceProductivityData}
            />

            <div className="grid gap-6 lg:grid-cols-2">
                <RecentProjects data={data?.recentProjects} />
                <UpcomingTasks data={data?.upcomingTasks} />
            </div>
        </div>
    );
}
