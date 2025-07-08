export interface User {
    _id: string;
    email: string;
    name: string;
    createdAt: Date;
    isEmailVerified: boolean;
    updatedAt: Date;
    profilePicture?: string;
    is2FAEnabled: boolean;
}

export interface Workspace {
    _id: string;
    name: string;
    description?: string;
    owner: User | string;
    color: string;
    members: {
        _id: string;
        user: User;
        role: 'ADMIN' | 'OWNER' | 'MEMBER' | 'VIEWER';
        joinedAt: Date;
    }[];
    createdAt: Date;
    updatedAt: Date;
}

// export type ProjectStatus = "PLANNING" | "IN PROGRESS" | "ON HOLD" | "COMPLETED" | "CANCELLED";

//@ts-ignore
export enum ProjectStatus {
    PLANNING = 'PLANNING',
    IN_PROGRESS = 'IN PROGRESS',
    ON_HOLD = 'ON HOLD',
    COMPLETED = 'COMPLETED',
    CANCELLLED = 'CANCELLED',
}

export interface Project {
    _id: string;
    title: string;
    description?: string;
    workspace: Workspace;
    status: ProjectStatus;
    startDate: Date;
    dueDate: Date;
    progress: number;
    tags: string[];
    tasks: Task[];
    members: {
        user: User;
        role: ProjectMemberRole;
    }[];
    isArchived: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export type TaskStatus = 'TO DO' | 'IN PROGRESS' | 'REVIEW' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';
//@ts-ignore
export enum ProjectMemberRole {
    MANAGER = 'MANAGER',
    CONTRIBUTOR = 'CONTRIBUTOR',
    VIEWER = 'VIEWER',
}

export interface Task {
    _id: string;
    title: string;
    description?: string;
    project: Project;
    status: TaskStatus;
    priority: TaskPriority;
    assignees?: User[];
    watchers?: User[];
    dueDate: Date;
    subtasks?: Subtask[];
    attachments?: Attachment[];
    assignee: User | string;
    createdBy: User | string;
    isArchived: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface Subtask {
    _id: string;
    title: string;
    completed: boolean;
    createdAt: Date;
}

export interface Attachment {
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
    uploadedBy: string;
    uploadedAt: Date;
    _id: string;
}

export interface Member {
    _id: string;
    user: User;
    role: 'ADMIN' | 'MEMBER' | 'OWNER' | 'VIEWER';
    joinedAt: Date;
}

export type ResourceType = 'TASK' | 'PROJECT' | 'WORKSPACE' | 'COMMENT' | 'USER';

export type ActionType =
    | 'CREATED_TASK'
    | 'UPDATED_TASK'
    | 'CREATED_SUBTASK'
    | 'UPDATED_SUBTASK'
    | 'COMPLETED_TASK'
    | 'CREATED_PROJECT'
    | 'UPDATED_PROJECT'
    | 'COMPLETED_PROJECT'
    | 'CREATED_WORKSPACE'
    | 'UPDATED_WORKSPACE'
    | 'ADDED_COMMENT'
    | 'ADDED_MEMBER'
    | 'REMOVED_MEMBER'
    | 'JOINED_WORKSPACE'
    | 'ADDED_ATTACHMENT';

export interface ActivityLog {
    _id: string;
    user: User;
    action: ActionType;
    resourceType: ResourceType;
    resourceId: string;
    details: any;
    createdAt: Date;
}

export interface CommentReaction {
    emoji: string;
    user: User;
}

export interface Comment {
    _id: string;
    author: User;
    text: string;
    createdAt: Date;
    reactions?: CommentReaction[];
    attachments?: {
        fileName: string;
        fileUrl: string;
        fileType?: string;
        fileSize?: number;
    }[];
}

export interface StatsCardProps {
    totalProjects: number;
    totalTasks: number;
    totalProjectInProgress: number;
    totalTaskCompleted: number;
    totalTaskToDo: number;
    totalTaskInProgress: number;
}

export interface TaskTrendsData {
    name: string;
    completed: number;
    inProgress: number;
    todo: number;
}

export interface TaskPriorityData {
    name: string;
    value: number;
    color: string;
}

export interface ProjectStatusData {
    name: string;
    value: number;
    color: string;
}

export interface WorkspaceProductivityData {
    name: string;
    completed: number;
    total: number;
}
