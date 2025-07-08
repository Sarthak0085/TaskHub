import Loader from '@/components/loader';
import { DeleteProject } from '@/components/project/delete-project';
import { UpdateProject } from '@/components/project/update-project';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useGetProjectQuery } from '@/hooks/use-project';
import { ProjectMemberRole, type Project } from '@/types';
import { useParams } from 'react-router-dom';

export default function ProjectSettings() {
    const { projectId } = useParams();
    const { data, isLoading } = useGetProjectQuery(projectId!) as {
        data: {
            project: Project;
        };
        isLoading: boolean;
    };

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className="w-full flex flex-col items-center justify-center">
            {/* Update Project  */}
            <UpdateProject projectId={projectId!} project={data?.project} />

            {/* Members List */}
            <Card className="w-full mb-6 max-w-[500px]">
                <CardHeader>
                    <CardTitle className="text-md font-semibold">Project Members</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                        List of all members in this project
                    </CardDescription>
                </CardHeader>

                {data?.project?.members.map((member) => (
                    <CardContent key={member?.user?._id} className="pb-4">
                        <div className="w-full flex items-center justify-between">
                            <div className="flex gap-2 items-center justify-center">
                                <Avatar className="size-8">
                                    <AvatarImage
                                        src={member?.user?.profilePicture}
                                        alt={member?.user?.name}
                                    />
                                    <AvatarFallback className="bg-blue-400 text-white">
                                        {member?.user?.name.substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="capitalize">{member?.user?.name}</span>
                            </div>
                            <Badge
                                variant={
                                    member?.role === ProjectMemberRole.MANAGER
                                        ? 'destructive'
                                        : 'muted'
                                }
                                className="p-2"
                            >
                                {member?.role}
                            </Badge>
                        </div>
                        <Separator className="mt-4" />
                    </CardContent>
                ))}
            </Card>

            {/* Delete Project */}
            <DeleteProject projectId={projectId!} />
        </div>
    );
}
