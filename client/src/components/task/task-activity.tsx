import { useGetActivityLogByResourceId } from '@/hooks/use-task';
import type { ActivityLog } from '@/types';
import Loader from '@/components/loader';
import { getActivityIcon } from './task-icon';
import { ScrollArea } from '../ui/scroll-area';

export const TaskActivity = ({ resourceId }: { resourceId: string }) => {
    const { data, isLoading } = useGetActivityLogByResourceId(resourceId) as {
        data: {
            activities: ActivityLog[];
        };
        isLoading: boolean;
    };

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className="bg-card rounded-lg shadow-sm mb-6">
            <h3 className="text-lg font-medium p-6 pb-0 mb-4">Activity</h3>

            <ScrollArea className="h-[800px] p-6 pt-0">
                <div className="space-y-4">
                    {data?.activities?.map((activity) => (
                        <div key={activity?._id} className="flex gap-2">
                            <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                {getActivityIcon(activity?.action)}
                            </div>

                            <div>
                                <p className="text-sm">
                                    <span className="font-semibold">{activity?.user?.name}</span>{' '}
                                    {activity?.details?.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
};
