import { useAuth } from '@/providers/auth-context';
import type { Workspace } from '@/types';
import { Button } from '@/components/ui/button';
import { PlusCircleIcon } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AvatarImage } from '@radix-ui/react-avatar';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { WorkspaceAvatar } from '@/components/workspace/workspace-avatar';

interface HeaderProps {
    onWorkspaceSelected: (workspace: Workspace) => void;
    selectedWorkspace: Workspace | null;
    onCreateWorkspace: () => void;
    workspaces: Workspace[] | [];
}

export const Header = ({
    onWorkspaceSelected,
    selectedWorkspace,
    onCreateWorkspace,
    workspaces,
}: HeaderProps) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const isOnWorkspacePage = useLocation().pathname.includes('/workspaces');

    const handleOnClick = (workspace: Workspace) => {
        onWorkspaceSelected(workspace);
        const location = window.location;

        if (isOnWorkspacePage) {
            navigate(`/workspaces/${workspace?._id}`);
        } else {
            const basePath = location.pathname;
            navigate(`${basePath}?workspaceId=${workspace?._id}`);
        }
    };

    return (
        <div className="bg-background sticky top-0 z-40 border-b">
            <div className="flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant={'outline'}>
                            {selectedWorkspace ? (
                                <>
                                    {selectedWorkspace?.color && (
                                        <WorkspaceAvatar
                                            color={selectedWorkspace?.color}
                                            name={selectedWorkspace?.name}
                                        />
                                    )}
                                    <p className="font-medium">{selectedWorkspace?.name}</p>
                                </>
                            ) : (
                                <span className="font-medium">Select Workspace</span>
                            )}
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent>
                        <DropdownMenuLabel>Workspace</DropdownMenuLabel>
                        <DropdownMenuSeparator />

                        <DropdownMenuGroup>
                            {workspaces.map((ws) => (
                                <DropdownMenuItem key={ws._id} onClick={() => handleOnClick(ws)}>
                                    {ws.color && (
                                        <WorkspaceAvatar color={ws.color} name={ws.name} />
                                    )}
                                    <span className="ml-2">{ws.name}</span>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuGroup>

                        <DropdownMenuGroup>
                            <DropdownMenuItem onClick={onCreateWorkspace}>
                                <PlusCircleIcon className="w-4 h-4 mr-1" />
                                Create Workspace
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>

                <div className="flex items-center gap-2">
                    {/* <Button variant={"ghost"} size={"icon"} className="cursor-pointer">
                        <Bell />
                    </Button> */}

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant={'ghost'}
                                size={'icon'}
                                className="cursor-pointer hover:bg-transparent"
                            >
                                <Avatar className="border border-blue-200 w-8 h-8">
                                    <AvatarImage src={user?.profilePicture} />
                                    <AvatarFallback className="bg-blue-500 text-white font-bold">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <Link to="/user/profile">Profile</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={logout}>Log Out</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    );
};
