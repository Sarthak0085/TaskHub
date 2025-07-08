import type { ActionType } from '@/types';
import {
    Building2,
    CheckCircle,
    CheckCircle2,
    CheckSquare,
    FileEdit,
    FolderEdit,
    FolderPlus,
    LogIn,
    MessageSquare,
    Upload,
    UserMinus,
    UserPlus,
} from 'lucide-react';

export const getActivityIcon = (action: ActionType) => {
    switch (action) {
        case 'CREATED_TASK':
            return (
                <div className="bg-green-600/10 p-2 rounded-md">
                    <CheckSquare className="h-5 w-5 text-green-600 rounded-full" />
                </div>
            );
        case 'CREATED_SUBTASK':
            return (
                <div className="bg-emerald-600/10 p-2 rounded-md">
                    <CheckSquare className="h-5 w-5 text-emerald-600 rounded-full" />
                </div>
            );
        case 'UPDATED_TASK':
        case 'UPDATED_SUBTASK':
            return (
                <div className="bg-blue-600/10 p-2 rounded-md">
                    <FileEdit className="h-5 w-5 text-blue-600 rounded-full" />
                </div>
            );
        case 'COMPLETED_TASK':
            return (
                <div className="bg-green-600/10 p-2 rounded-md">
                    <CheckCircle className="h-5 w-5 text-green-600 rounded-full" />
                </div>
            );
        case 'CREATED_PROJECT':
            return (
                <div className="bg-blue-600/10 p-2 rounded-md">
                    <FolderPlus className="h-5 w-5 text-blue-600 rounded-full" />
                </div>
            );
        case 'UPDATED_PROJECT':
            return (
                <div className="bg-blue-600/10 p-2 rounded-md">
                    <FolderEdit className="h-5 w-5 text-blue-600 rounded-full" />
                </div>
            );
        case 'COMPLETED_PROJECT':
            return (
                <div className="bg-green-600/10 p-2 rounded-md">
                    <CheckCircle2 className="h-5 w-5 text-green-600 rounded-full" />
                </div>
            );
        case 'CREATED_WORKSPACE':
            return (
                <div className="bg-blue-600/10 p-2 rounded-md">
                    <Building2 className="h-5 w-5 text-blue-600 rounded-full" />
                </div>
            );
        case 'ADDED_COMMENT':
            return (
                <div className="bg-blue-600/10 p-2 rounded-md">
                    <MessageSquare className="h-5 w-5 text-blue-600 rounded-full" />
                </div>
            );
        case 'ADDED_MEMBER':
            return (
                <div className="bg-blue-600/10 p-2 rounded-md">
                    <UserPlus className="h-5 w-5 text-blue-600 rounded-full" />
                </div>
            );
        case 'REMOVED_MEMBER':
            return (
                <div className="bg-red-600/10 p-2 rounded-md">
                    <UserMinus className="h-5 w-5 text-red-600 rounded-full" />
                </div>
            );
        case 'JOINED_WORKSPACE':
            return (
                <div className="bg-blue-600/10 p-2 rounded-md">
                    <LogIn className="h-5 w-5 text-blue-600 rounded-full" />
                </div>
            );
        case 'ADDED_ATTACHMENT':
            return (
                <div className="bg-blue-600/10 p-2 rounded-md">
                    <Upload className="h-5 w-5 text-blue-600 rounded-full" />
                </div>
            );
        default:
            return null;
    }
};
