import Loader from '@/components/loader';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetWorkspaceDetailsQuery } from '@/hooks/use-workspace';
import type { Workspace } from '@/types';
import { LayoutGrid } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function Members() {
    const [searchParams, setSearchParams] = useSearchParams();

    const initialSearch = searchParams.get('search') || '';
    const workspaceId = searchParams.get('workspaceId') || '';

    const [search, setSearch] = useState<string>(initialSearch);

    const { data, isLoading } = useGetWorkspaceDetailsQuery(workspaceId) as {
        data: {
            workspace: Workspace;
        };
        isLoading: boolean;
    };

    useEffect(() => {
        const params: Record<string, string> = {};
        searchParams.forEach((value, key) => (params[key] = value));

        params.search = search;

        setSearchParams(params, { replace: true });
    }, [search]);

    useEffect(() => {
        const urlSearch = searchParams.get('search') || '';

        if (urlSearch !== search) setSearch(urlSearch);
    }, [searchParams]);

    const filteredMembers = data?.workspace?.members.filter(
        (member) =>
            member?.user?.name.toLowerCase().includes(search.toLowerCase()) ||
            member?.user?.email.toLowerCase().includes(search.toLowerCase()) ||
            member?.role.toLowerCase().includes(search.toLowerCase())
    );

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
        <div className="space-y-6">
            <div className="flex items-start md:items-center justify-between">
                <h1 className="text-2xl font-bold">Members</h1>
            </div>

            <Input
                type="text"
                value={search}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                placeholder="Search members..."
                className="max-w-xs"
            />

            <Tabs defaultValue="list">
                <TabsList>
                    <TabsTrigger value="list">List View</TabsTrigger>
                    <TabsTrigger value="grid">Grid View</TabsTrigger>
                </TabsList>

                {/* LIST VIEW  */}
                <TabsContent value="list" className="mb-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Members</CardTitle>
                            <CardDescription>
                                {filteredMembers?.length}{' '}
                                {filteredMembers?.length > 1 ? 'members' : 'member'} in this
                                workspace
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <div className="divide-y">
                                {filteredMembers?.map((member) => (
                                    <div
                                        key={member?.user?._id}
                                        className="flex items-center flex-col md:flex-row justify-between p-4 gap-4 "
                                    >
                                        <div className="flex items-center space-x-4">
                                            <Avatar>
                                                <AvatarImage
                                                    src={member?.user?.profilePicture}
                                                    alt={member?.user?.name}
                                                />
                                                <AvatarFallback className="bg-blue-400 text-white">
                                                    {member?.user?.name.charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>

                                            <div>
                                                <h3 className="font-medium">
                                                    {member?.user?.name}
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {member?.user?.email}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-1 ml-11 md:ml-0">
                                            <Badge
                                                variant={
                                                    ['ADMIN', 'OWNER'].includes(member?.role)
                                                        ? 'destructive'
                                                        : 'muted'
                                                }
                                            >
                                                {member?.role}
                                            </Badge>

                                            <Badge variant={'outline'}>
                                                {data?.workspace?.name}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* GRID VIEW  */}
                <TabsContent value="grid" className="mb-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredMembers?.map((member) => (
                            <Card key={member?.user?._id}>
                                <CardContent className="p-6 flex flex-col items-center text-center space-y-2">
                                    <Avatar className="size-20">
                                        <AvatarImage
                                            src={member?.user?.profilePicture}
                                            alt={member?.user?.name}
                                        />
                                        <AvatarFallback className="bg-blue-400 text-white uppercase text-3xl">
                                            {member?.user?.name.substring(0, 2)}
                                        </AvatarFallback>
                                    </Avatar>

                                    <h3 className="text-lg font-medium">{member?.user?.name}</h3>

                                    <p className="text-sm text-gray-500 pb-1">
                                        {member?.user?.email}
                                    </p>

                                    <Badge
                                        variant={
                                            ['ADMIN', 'OWNER'].includes(member?.role)
                                                ? 'destructive'
                                                : 'muted'
                                        }
                                    >
                                        {member?.role}
                                    </Badge>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
