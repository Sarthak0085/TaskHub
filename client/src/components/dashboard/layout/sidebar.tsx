import { cn } from '@/lib/utils';
import { useAuth } from '@/providers/auth-context';
import type { Workspace } from '@/types';
import {
    CheckCircle2,
    ChevronsLeft,
    ChevronsRight,
    LayoutDashboard,
    ListCheck,
    LogOut,
    Settings,
    Users,
    Wrench,
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SidebarNav } from './sidebar-nav';

export const Sidebar = ({ currentWorkspace }: { currentWorkspace: Workspace | null }) => {
    const { logout } = useAuth();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const navItems = [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutDashboard,
        },
        {
            title: 'Workspaces',
            href: '/workspaces',
            icon: Users,
        },
        {
            title: 'My Tasks',
            href: '/my-tasks',
            icon: ListCheck,
        },
        {
            title: 'Members',
            href: `/members`,
            icon: Users,
        },
        {
            title: 'Archived',
            href: `/archived`,
            icon: CheckCircle2,
        },
        {
            title: 'Settings',
            href: '/settings',
            icon: Settings,
        },
    ];

    return (
        <div
            className={cn(
                'flex relative flex-col border-r bg-sidebar transition-all duration-300',
                isCollapsed ? 'w-16 md:w[80px]' : 'w-16 md:w-[240px]'
            )}
        >
            <div className="flex h-14 items-center border-b px-4 mb-4">
                <Link to="/dashboard" className="flex items-center mt-5">
                    {!isCollapsed && (
                        <div className="flex items-center gap-2">
                            <Wrench className="size-6 text-blue-600" />
                            <span className="font-semibold text-lg hidden md:block">TaskHub</span>
                        </div>
                    )}

                    {isCollapsed && <Wrench className="size-6 text-blue-600" />}
                </Link>

                <Button
                    variant={'ghost'}
                    size="icon"
                    className="absolute top-0 right-0 hover:bg-transparent cursor-pointer hidden md:block"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    {isCollapsed ? (
                        <ChevronsRight className="size-4" />
                    ) : (
                        <ChevronsLeft className="size-4" />
                    )}
                </Button>
            </div>

            <ScrollArea className="flex-1 px-3 py-2">
                <SidebarNav
                    items={navItems}
                    isCollapsed={isCollapsed}
                    className={cn(isCollapsed && 'items-center space-y-2')}
                    currentWorkspace={currentWorkspace}
                />
            </ScrollArea>

            <div className={cn(isCollapsed ? 'text-center' : 'ml-3')}>
                <Button
                    variant={'ghost'}
                    size={isCollapsed ? 'icon' : 'default'}
                    onClick={logout}
                    className="cursor-pointer"
                >
                    <LogOut className={cn('size-4', isCollapsed && 'mx-auto')} />
                    <span className={cn('hidden md:block', isCollapsed && 'sr-only')}>Logout</span>
                </Button>
            </div>
        </div>
    );
};
