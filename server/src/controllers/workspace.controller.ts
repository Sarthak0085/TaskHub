import { NextFunction, Request, Response } from 'express';
import { catchAsyncError } from '../middleware/catchAsyncError.js';
import Workspace from '../models/workspace.model.js';
import ErrorHandler from '../utils/ErrorHandler.js';
import Project, { IProject } from '../models/project.model.js';
import Task, { ITask } from '../models/task.model.js';
import User from '../models/user.model.js';
import WorkspaceInvite from '../models/workspace-invite.model.js';
import jwt, { JwtPayload } from 'jsonwebtoken';
import sendEmail from '../utils/send-mail.js';
import { recordActivity } from '../libs/index.js';
import { Types } from 'mongoose';
import Comment from '../models/comment.model.js';

// create workspace
export const createWorkspace = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { name, description, color } = req.body;

            const workspace = await Workspace.create({
                name,
                description,
                color,
                owner: req.user?._id,
                members: [
                    {
                        user: req.user?._id,
                        role: 'OWNER',
                        joinedAt: new Date(),
                    },
                ],
            });

            res.status(201).send(workspace);
        } catch (error: any) {
            console.log(error);
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// get workspaces
export const getWorkspaces = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const workspaces = await Workspace.find({
                'members.user': req.user?._id,
            }).sort({ createdAt: -1 });
            res.status(200).json(workspaces);
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// get workspace details
export const getWorkspaceDetails = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { workspaceId } = req.params;

            const workspace = await Workspace.findOne({
                _id: workspaceId,
            }).populate('members.user', 'name email profilePicture');

            if (!workspace) {
                return next(new ErrorHandler('Workspace not found', 404));
            }

            return res.status(200).send({
                success: true,
                workspace,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// get workspace projects
export const getWorkspaceProjects = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { workspaceId } = req.params;

            const workspace = await Workspace.findOne({
                _id: workspaceId,
                'members.user': req.user?._id,
            }).populate('members.user', 'name email profilePicture');

            if (!workspace) {
                return next(new ErrorHandler('Workspace not found', 404));
            }

            const projects = await Project.find({
                workspace: workspaceId,
                isArchived: false,
                'members.user': req.user?._id,
            })
                .populate('tasks', 'status title project priority')
                .sort({ createdAt: -1 });

            return res.status(200).send({
                success: true,
                workspace,
                projects,
            });
        } catch (error: any) {
            console.error('workspace projects error :', error);
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

export type PopulatedProject = Omit<IProject, 'tasks'> & {
    tasks: ITask[];
};

// get workspace stats
export const getWorkspaceStats = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { workspaceId } = req.params;

            const workspace = await Workspace.findById(workspaceId);

            if (!workspace) {
                return next(new ErrorHandler('Workspace not found', 404));
            }

            const isMember = workspace.members.some(
                (member) => member?.user?.toString() === req?.user?._id.toString()
            );

            if (!isMember) {
                return next(new ErrorHandler('You are not a member of this workspace', 403));
            }

            const [totalProjects, projects] = await Promise.all([
                Project.countDocuments({ workspace: workspaceId }),
                Project.find({ workspace: workspaceId })
                    .populate('tasks', 'title status dueDate project updatedAt isArchived priority')
                    .sort({ createdAt: -1 }) as unknown as PopulatedProject[],
            ]);

            console.log('Projects :', projects);
            console.log('projects count :', totalProjects);

            const totalTasks = projects.reduce((acc, project) => acc + project.tasks.length, 0);

            const totalProjectInProgress = projects.filter(
                (project) => project.status === 'IN PROGRESS'
            ).length;

            const totalTaskCompleted = projects.reduce((acc, project) => {
                return acc + project.tasks.filter((task) => task.status === 'DONE').length;
            }, 0);

            const totalTaskToDo = projects.reduce((acc, project) => {
                return acc + project.tasks.filter((task) => task.status === 'TO DO').length;
            }, 0);

            const totalTaskInProgress = projects.reduce((acc, project) => {
                return acc + project.tasks.filter((task) => task.status === 'IN PROGRESS').length;
            }, 0);

            const tasks = projects.flatMap((project) => project.tasks) as ITask[];
            // console.log("Tasks :", projects.map((project)=>project.tasks));

            // get upcoming tasks in 7 days
            const upcomingTasks = tasks.filter((task) => {
                const dueDate = new Date(task.dueDate!);
                const today = new Date();
                return (
                    dueDate > today &&
                    dueDate <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
                );
            });

            const taskTrendsData = [
                { name: 'Sun', completed: 0, inProgress: 0, toDo: 0 },
                { name: 'Mon', completed: 0, inProgress: 0, toDo: 0 },
                { name: 'Tue', completed: 0, inProgress: 0, toDo: 0 },
                { name: 'Wed', completed: 0, inProgress: 0, toDo: 0 },
                { name: 'Thu', completed: 0, inProgress: 0, toDo: 0 },
                { name: 'Fri', completed: 0, inProgress: 0, toDo: 0 },
                { name: 'Sat', completed: 0, inProgress: 0, toDo: 0 },
            ];

            // get last 7 days tasks date
            const last7Days = Array.from({ length: 7 }, (_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - i);
                return date;
            }).reverse();

            for (const project of projects) {
                for (const task of project.tasks) {
                    console.log('Task :', task);
                    const tsk = task as any;
                    const taskDate = new Date(tsk?.updatedAt);

                    const dayInDate = last7Days.findIndex(
                        (date) =>
                            date.getDate() === taskDate.getDate() &&
                            date.getMonth() === taskDate.getMonth() &&
                            date.getFullYear() === taskDate.getFullYear()
                    );

                    if (dayInDate !== -1) {
                        const dayName = last7Days[dayInDate].toLocaleDateString('en-US', {
                            weekday: 'short',
                        });

                        const dayData = taskTrendsData.find((day) => day.name === dayName);

                        if (dayData) {
                            switch (tsk.status) {
                                case 'DONE':
                                    dayData.completed++;
                                    break;
                                case 'IN PROGRESS':
                                    dayData.inProgress++;
                                    break;
                                case 'TO DO':
                                    dayData.toDo++;
                                    break;
                            }
                        }
                    }
                }
            }

            // get project status distribution
            const projectStatusData = [
                { name: 'COMPLETED', value: 0, color: '#10b981' },
                { name: 'IN PROGRESS', value: 0, color: '#3b82f6' },
                { name: 'PLANNING', value: 0, color: '#f59e0b' },
            ];

            for (const project of projects) {
                switch (project.status) {
                    case 'COMPLETED':
                        projectStatusData[0].value++;
                        break;
                    case 'IN PROGRESS':
                        projectStatusData[1].value++;
                        break;
                    case 'PLANNING':
                        projectStatusData[2].value++;
                        break;
                }
            }

            // Task priority distribution
            const taskPriorityData = [
                { name: 'HIGH', value: 0, color: '#ef4444' },
                { name: 'MEDIUM', value: 0, color: '#f59e0b' },
                { name: 'LOW', value: 0, color: '#6b7280' },
            ];

            for (const task of tasks) {
                switch (task.priority) {
                    case 'HIGH':
                        taskPriorityData[0].value++;
                        break;
                    case 'MEDIUM':
                        taskPriorityData[1].value++;
                        break;
                    case 'LOW':
                        taskPriorityData[2].value++;
                        break;
                }
            }

            const workspaceProductivityData = [];

            for (const project of projects) {
                const totalProjectTasks = tasks.filter(
                    (task: ITask) => task.project.toString() === project?._id.toString()
                );

                const completedProjectTasks = totalProjectTasks.filter(
                    (task: ITask) => task.status === 'DONE' && task.isArchived === false
                );

                workspaceProductivityData.push({
                    name: project?.title,
                    completed: completedProjectTasks.length,
                    total: totalProjectTasks.length,
                });
            }

            const stats = {
                totalProjects,
                totalTasks,
                totalProjectInProgress,
                totalTaskCompleted,
                totalTaskToDo,
                totalTaskInProgress,
            };

            return res.status(200).send({
                success: true,
                stats,
                taskTrendsData,
                taskPriorityData,
                projectStatusData,
                workspaceProductivityData,
                upcomingTasks,
                recentProjects: projects.slice(0, 5),
            });
        } catch (error: any) {
            console.error('Workspace stats error :', error);
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// invite user to workspace
export const inviteUserToWorkspace = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { workspaceId } = req.params;
            const { email, role } = req.body;

            const workspace = await Workspace.findById(workspaceId);
            console.log('workspace :', workspace);

            if (!workspace) {
                return next(new ErrorHandler('Workspace not found', 404));
            }

            const userMemberInfo = workspace?.members.find(
                (member) => member?.user?.toString() === req?.user?._id.toString()
            );

            if (!userMemberInfo || !['ADMIN', 'OWNER'].includes(userMemberInfo?.role)) {
                return next(
                    new ErrorHandler(
                        'You are not authorized to invite members to this workspace',
                        403
                    )
                );
            }

            const existingUser = await User.findOne({ email });

            if (!existingUser) {
                return next(new ErrorHandler('User not found', 404));
            }

            const isMember = workspace?.members.some(
                (member) => member?.user?.toString() === existingUser?._id.toString()
            );

            if (isMember) {
                return next(new ErrorHandler('User already a member of this workspace', 400));
            }

            const isInvited = await WorkspaceInvite.findOne({
                user: existingUser?._id,
                workspace: workspaceId,
            });

            if (isInvited && isInvited?.expiresAt > new Date()) {
                return next(new ErrorHandler('User already invited to this workspace', 400));
            }

            if (isInvited && isInvited?.expiresAt < new Date()) {
                await WorkspaceInvite.deleteOne({ _id: isInvited?._id });
            }

            const inviteToken = jwt.sign(
                {
                    user: existingUser?._id,
                    workspaceId: workspaceId,
                    role: role || 'MEMBER',
                },
                process.env.JWT_SECRET!,
                { expiresIn: '7d' }
            );

            await WorkspaceInvite.create({
                user: existingUser?._id,
                workspace: workspaceId,
                role: role || 'MEMBER',
                token: inviteToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) as Date,
            });

            const invitationLink = `${process.env.FRONTEND_URL}/workspace-invite/${workspace._id}?tk=${inviteToken}`;

            await sendEmail({
                email: email,
                subject: 'Invitation to join workspace',
                template: 'invite-user-workspace.ejs',
                cloudinaryCode: 'v1751719802',
                data: {
                    name: existingUser?.name,
                    confirmLink: invitationLink,
                },
            });

            return res.status(200).json({
                success: true,
                message: 'Invitation sent successfully',
            });
        } catch (error: any) {
            console.error('Invite user to workspace error :', error);
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// accept generate invite
export const acceptGenerateInvite = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { workspaceId } = req.params;

            const workspace = await Workspace.findById(workspaceId);

            if (!workspace) {
                return next(new ErrorHandler('Workspace not found', 404));
            }

            const isMember = workspace?.members.some(
                (member) => member?.user.toString() === req?.user?._id.toString()
            );

            if (isMember) {
                return next(new ErrorHandler('You are already a member of this workspace', 409));
            }

            workspace?.members.push({
                user: new Types.ObjectId(req?.user?._id),
                role: 'MEMBER',
                joinedAt: new Date(),
            });

            await workspace.save();

            await recordActivity({
                userId: req?.user?._id,
                action: 'JOINED_WORKSPACE',
                resourceId: workspaceId,
                resourceType: 'WORKSPACE',
                details: { description: `Joined ${workspace?.name} workspace` },
            });

            res.status(200).json({
                success: true,
                message: 'Invitation accepted successfully',
            });
        } catch (error: any) {
            console.error('Accept Generate Error :', error);
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// accept invite by token
export const acceptInviteByToken = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { token } = req.body;

            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

            if (!decoded) {
                return next(new ErrorHandler('Invitation token expired', 400));
            }

            const { user, workspaceId, role } = decoded;

            const workspace = await Workspace.findById(workspaceId);
            console.log('workspace :', workspace);

            if (!workspace) {
                return next(new ErrorHandler('Workspace not found', 404));
            }

            if (user.toString() !== req?.user?._id.toString()) {
                return next(new ErrorHandler('You are not invited to join workspace', 409));
            }

            const isMember = workspace?.members.some(
                (member) => member?.user?.toString() === user?.toString()
            );

            if (isMember) {
                return next(new ErrorHandler('You are already a member of this workspace', 403));
            }

            const inviteInfo = await WorkspaceInvite.findOne({
                user: user,
                workspace: workspaceId,
            });

            if (!inviteInfo) {
                return next(new ErrorHandler('Invitation not found', 404));
            }

            if (inviteInfo?.expiresAt < new Date()) {
                return next(new ErrorHandler('Invitation has expired', 400));
            }

            workspace.members.push({
                user: user,
                role: role || 'MEMBER',
                joinedAt: new Date(),
            });

            await workspace.save();

            await Promise.all([
                WorkspaceInvite.deleteOne({ _id: inviteInfo._id }),
                recordActivity({
                    userId: user,
                    action: 'JOINED_WORKSPACE',
                    resourceType: 'WORKSPACE',
                    resourceId: workspaceId,
                    details: { description: `Joined ${workspace?.name} workspace` },
                }),
            ]);

            res.status(200).json({
                success: true,
                message: 'Invitation accepted successfully',
            });
        } catch (error: any) {
            console.error('accept invite error :', error);
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// update workspace
export const updateWorkspace = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { workspaceId } = req.params;
            const { name, description, color } = req.body;

            const workspace = await Workspace.findById(workspaceId);

            if (!workspace) {
                return next(new ErrorHandler('Workspace not found', 404));
            }

            const isMember = workspace?.members.find(
                (member) => member?.user.toString() === req?.user?._id.toString()
            );

            if (!isMember) {
                return next(new ErrorHandler('You are not a member of this workspace', 403));
            }

            if (!['ADMIN', 'OWNER'].includes(isMember?.role)) {
                return next(new ErrorHandler('You are not allowed to update the workspace', 409));
            }

            const oldName = workspace?.name;
            const oldDescription = workspace?.description;
            const oldColor = workspace?.color;

            if (name !== undefined) workspace.name = name;
            if (description !== undefined) workspace.description = description;
            if (color !== undefined) workspace.color = color;

            await workspace.save();

            if (name !== oldName) {
                await recordActivity({
                    userId: req?.user?._id,
                    resourceId: workspaceId,
                    resourceType: 'WORKSPACE',
                    action: 'UPDATED_WORKSPACE',
                    details: { description: `workspace name updated from ${oldName} to ${name}` },
                });
            }

            if (description !== oldDescription) {
                await recordActivity({
                    userId: req?.user?._id,
                    resourceId: workspaceId,
                    resourceType: 'WORKSPACE',
                    action: 'UPDATED_WORKSPACE',
                    details: {
                        description: `workspace description updated from ${oldDescription && oldDescription.length > 20 ? oldDescription?.substring(0, 20) + '...' : oldDescription} to ${description.length > 20 ? description.substring(0, 20) + '...' : description}`,
                    },
                });
            }

            if (oldColor !== color) {
                await recordActivity({
                    userId: req?.user?._id,
                    resourceId: workspaceId,
                    resourceType: 'WORKSPACE',
                    action: 'UPDATED_WORKSPACE',
                    details: {
                        description: `workspace color updated from ${oldColor} to ${color}`,
                    },
                });
            }

            return res.status(200).send({
                success: true,
                message: 'Workspace updated successfully',
                workspace,
            });
        } catch (error: any) {
            console.error('Update Workspace Error :', error);
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// change workspace ownership
export const changeWorkspaceOwner = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { workspaceId } = req.params;
            const { userId, role } = req.body;

            if (userId.toString() === req?.user?._id.toString()) {
                return next(
                    new ErrorHandler('You are already having the ownership of this workspace', 409)
                );
            }

            const workspace = await Workspace.findById(workspaceId).populate(
                'members.user',
                '_id name profilePicture'
            );

            if (!workspace) {
                return next(new ErrorHandler('Workspace not found', 404));
            }

            const isMember = workspace?.members.find(
                (member) => member?.user?._id.toString() === req?.user?._id.toString()
            );

            if (!isMember) {
                return next(new ErrorHandler('You are not a member of this workspace', 403));
            }

            if (!['ADMIN', 'OWNER'].includes(isMember?.role)) {
                return next(
                    new ErrorHandler('You are not allowed to transfer the workspace ownership', 409)
                );
            }

            const isUserMember = workspace?.members.find(
                (member) => member?.user?._id.toString() === userId.toString()
            );

            if (!isUserMember) {
                return next(new ErrorHandler('User is not a member of this workspace', 403));
            }

            isUserMember.role = role || 'OWNER';
            isMember.role = 'MEMBER';
            workspace.owner = userId;
            await workspace.save();

            await recordActivity({
                userId: req?.user?._id,
                resourceId: workspaceId,
                resourceType: 'WORKSPACE',
                action: 'TRANSFERRED_WORKSPACE_OWNERSHIP',
                //@ts-ignore
                details: { description: `Workspace "${workspace?.name}" ownership changed from ${isMember?.  user?.name}  to ${isUserMember?.user?.name}`,
                },
            });

            return res.status(200).send({
                success: true,
                message: 'Workspace owner changed successfully',
                workspace,
            });
        } catch (error: any) {
            console.error('Change Workspace Ownership Error :', error);
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// delete workspace
export const deleteWorkspace = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { workspaceId } = req.params;

            const workspace = await Workspace.findById(workspaceId);

            if (!workspace) {
                return next(new ErrorHandler('Workspace not found', 404));
            }

            const title = workspace?.name;

            const isMember = workspace?.members.find(
                (member) => member?.user.toString() === req?.user?._id.toString()
            );

            if (!isMember) {
                return next(new ErrorHandler('You are not a member of this workspace', 403));
            }

            if (!['ADMIN', 'OWNER'].includes(isMember?.role)) {
                return next(new ErrorHandler('You are not allowed to update the workspace', 409));
            }

            // get all projects
            const projects = await Project.find({ workspace: workspaceId });
            const projectIds = projects.map((project) => project?._id);

            // get all tasks
            const tasks = await Task.find({ project: { $in: projectIds } });
            const taskIds = tasks.map((task) => task?._id);

            // delete all comments of above tasks
            await Comment.deleteMany({ task: { $in: taskIds } });

            // delete all tasks of the projects Ids
            await Task.deleteMany({ project: { $in: projectIds } });

            // delete all the projects of the workspaceId
            await Project.deleteMany({ workspace: { $in: workspaceId } });

            // delete all the invites of the given workspaceId
            await WorkspaceInvite.deleteMany({ workspace: { $in: workspaceId } });

            // delete workspace
            await Workspace.deleteOne({ _id: workspaceId });

            return res.status(200).send({
                success: true,
                message: `Workspace "${title}" deleted successfully`,
                title,
            });
        } catch (error: any) {
            console.error('Delete Workspace Error :', error);
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// archived projects and tasks
export const getArchivedData = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { workspaceId } = req.params;

            const workspace = await Workspace.findById(workspaceId);

            if (!workspace) {
                return next(new ErrorHandler('Workspace not found', 404));
            }

            const projects = await Project.find({
                workspace: workspaceId,
            }).select('_id');

            const projectIds = projects.map((project) => project._id);

            const archivedProjects = await Project.find({
                workspace: workspaceId,
                isArchived: true,
                'members.user': req.user?._id,
            })
                .populate('tasks', 'status title project priority')
                .sort({ createdAt: -1 });

            const archivedTasks = await Task.find({
                project: { $in: projectIds },
                isArchived: true,
                assignees: { $in: [req?.user?._id] },
            })
                .populate('assignees', 'name profilePicture')
                .sort({ createdAt: -1 });

            return res.status(200).send({
                success: true,
                archivedProjects,
                archivedTasks,
            });
        } catch (error: any) {
            console.error('Archived Data Fetching Error :', error);
            return next(new ErrorHandler(error.message, 500));
        }
    }
);
