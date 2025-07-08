import { NextFunction, Request, Response } from 'express';
import { catchAsyncError } from '../middleware/catchAsyncError.js';
import ErrorHandler from '../utils/ErrorHandler.js';
import Project from '../models/project.model.js';
import Workspace from '../models/workspace.model.js';
import Task, { ITask } from '../models/task.model.js';
import { recordActivity } from '../libs/index.js';
import ActivityLog from '../models/activity-log.model.js';
import Comment from '../models/comment.model.js';
import { Types } from 'mongoose';

// create task
export const createTask = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { projectId } = req.params;
            const { title, description, status, priority, dueDate, assignees } = req.body;

            const project = await Project.findById(projectId);

            if (!project) {
                return next(new ErrorHandler('Project not found', 404));
            }

            const workspace = await Workspace.findById(project.workspace);

            if (!workspace) {
                return next(new ErrorHandler('Workspace not found', 404));
            }

            const isMember = project.members.some(
                (member) => member?.user.toString() === req?.user?._id.toString()
            );
            console.log('is Member', isMember);

            if (!isMember) {
                return next(new ErrorHandler('You are not a memeber of this project', 403));
            }

            const newTask = await Task.create({
                title,
                description,
                status,
                priority,
                dueDate,
                assignees,
                project: projectId,
                createdBy: req?.user?._id,
            });

            if (!newTask) {
                return next(new ErrorHandler('Error while creating a task', 400));
            }

            project.tasks.push(newTask?._id);
            await project.save();

            return res.status(200).send({
                success: true,
                task: newTask,
            });
        } catch (error: any) {
            console.error(error);
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// get task by ID
export const getTaskById = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { taskId } = req.params;

            const task = await Task.findById(taskId)
                .populate('assignees', 'name profilePicture')
                .populate('watchers', 'name profilePicture');

            if (!task) {
                return next(new ErrorHandler('Task not found', 404));
            }

            const project = await Project.findById(task.project).populate(
                'members.user',
                'name profilePicture'
            );

            if (!project) {
                return next(new ErrorHandler('Project not found', 404));
            }

            return res.status(200).send({
                success: true,
                task,
                project,
            });
        } catch (error: any) {
            console.error(error);
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// update task title
export const updateTaskTitle = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { taskId } = req.params;
            const { title } = req.body;

            const task = await Task.findById(taskId);

            if (!task) {
                return next(new ErrorHandler('Task not found', 404));
            }

            const project = await Project.findById(task.project).populate(
                'members.user',
                'name profilePicture'
            );

            if (!project) {
                return next(new ErrorHandler('Project not found', 404));
            }

            const isMember = project.members.some(
                (member) => member?.user?._id.toString() === req?.user?._id.toString()
            );

            if (!isMember) {
                return next(new ErrorHandler('You are not a memeber of this project', 403));
            }

            const oldTitle = task.title;

            task.title = title;
            await task.save();

            await recordActivity({
                userId: req?.user?._id,
                action: 'UPDATED_TASK',
                resourceType: 'TASK',
                resourceId: taskId,
                details: { description: `updated task title from ${oldTitle} to ${title}` },
            });

            return res.status(200).send({
                success: true,
                task,
            });
        } catch (error: any) {
            console.error(error);
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// update task description
export const updateTaskDescription = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { taskId } = req.params;
            const { description } = req.body;

            const task = await Task.findById(taskId);

            if (!task) {
                return next(new ErrorHandler('Task not found', 404));
            }

            const project = await Project.findById(task.project).populate(
                'members.user',
                'name profilePicture'
            );

            if (!project) {
                return next(new ErrorHandler('Project not found', 404));
            }

            const isMember = project.members.some(
                (member) => member?.user?._id.toString() === req?.user?._id.toString()
            );

            if (!isMember) {
                return next(new ErrorHandler('You are not a memeber of this project', 403));
            }

            const oldDescription =
                task.description.substring(0, 50) + (task.description.length > 50 ? '...' : '');
            const newDescription =
                description.substring(0, 50) + (description.length > 50 ? '...' : '');

            task.description = description;
            await task.save();

            await recordActivity({
                userId: req?.user?._id,
                action: 'UPDATED_TASK',
                resourceType: 'TASK',
                resourceId: taskId,
                details: {
                    description: `updated task description from ${oldDescription} to ${newDescription}`,
                },
            });

            return res.status(200).send({
                success: true,
                task,
            });
        } catch (error: any) {
            console.error(error);
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// update task status
export const updateTaskStatus = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { taskId } = req.params;
            const { status } = req.body;

            const task = await Task.findById(taskId);

            if (!task) {
                return next(new ErrorHandler('Task not found', 404));
            }

            const project = await Project.findById(task.project).populate(
                'members.user',
                'name profilePicture'
            );

            if (!project) {
                return next(new ErrorHandler('Project not found', 404));
            }

            const isMember = project.members.some(
                (member) => member?.user?._id.toString() === req?.user?._id.toString()
            );

            if (!isMember) {
                return next(new ErrorHandler('You are not a memeber of this project', 403));
            }

            const oldStatus = task.status;

            task.status = status;
            await task.save();

            await recordActivity({
                userId: req?.user?._id,
                action: 'UPDATED_TASK',
                resourceType: 'TASK',
                resourceId: taskId,
                details: { description: `updated task status from ${oldStatus} to ${status}` },
            });

            return res.status(200).send({
                success: true,
                task,
            });
        } catch (error: any) {
            console.error(error);
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// update task assignees
export const updateTaskAssignees = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { taskId } = req.params;
            const { assignees } = req.body;

            const task = await Task.findById(taskId);

            if (!task) {
                return next(new ErrorHandler('Task not found', 404));
            }

            const project = await Project.findById(task.project).populate(
                'members.user',
                'name profilePicture'
            );

            if (!project) {
                return next(new ErrorHandler('Project not found', 404));
            }

            const isMember = project.members.some(
                (member) => member?.user?._id.toString() === req?.user?._id.toString()
            );

            if (!isMember) {
                return next(new ErrorHandler('You are not a memeber of this project', 403));
            }

            const oldAssignees = task.assignees;

            task.assignees = assignees;
            await task.save();

            await recordActivity({
                userId: req?.user?._id,
                action: 'UPDATED_TASK',
                resourceType: 'TASK',
                resourceId: taskId,
                details: {
                    description: `updated task assignees from ${oldAssignees.length} to ${assignees.length}`,
                },
            });

            return res.status(200).send({
                success: true,
                task,
            });
        } catch (error: any) {
            console.error(error);
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// update task priority
export const updateTaskPriority = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { taskId } = req.params;
            const { priority } = req.body;

            const task = await Task.findById(taskId);

            if (!task) {
                return next(new ErrorHandler('Task not found', 404));
            }

            const project = await Project.findById(task.project).populate(
                'members.user',
                'name profilePicture'
            );

            if (!project) {
                return next(new ErrorHandler('Project not found', 404));
            }

            const isMember = project.members.some(
                (member) => member?.user?._id.toString() === req?.user?._id.toString()
            );

            if (!isMember) {
                return next(new ErrorHandler('You are not a memeber of this project', 403));
            }

            const oldPriority = task.priority;

            task.priority = priority;
            await task.save();

            await recordActivity({
                userId: req?.user?._id,
                action: 'UPDATED_TASK',
                resourceType: 'TASK',
                resourceId: taskId,
                details: {
                    description: `updated task priority from ${oldPriority} to ${priority}`,
                },
            });

            return res.status(200).send({
                success: true,
                task,
            });
        } catch (error: any) {
            console.error(error);
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// add subtask
export const addSubTask = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { taskId } = req.params;
            const { title } = req.body;

            const task = await Task.findById(taskId);

            if (!task) {
                return next(new ErrorHandler('Task not found', 404));
            }

            const project = await Project.findById(task.project).populate(
                'members.user',
                'name profilePicture'
            );

            if (!project) {
                return next(new ErrorHandler('Project not found', 404));
            }

            const isMember = project.members.some(
                (member) => member?.user?._id.toString() === req?.user?._id.toString()
            );

            if (!isMember) {
                return next(new ErrorHandler('You are not a memeber of this project', 403));
            }

            const newSubTask = {
                title,
                completed: false,
            };

            task.subtasks.push(newSubTask);
            await task.save();

            await recordActivity({
                userId: req?.user?._id,
                action: 'CREATED_SUBTASK',
                resourceType: 'TASK',
                resourceId: taskId,
                details: { description: `created subtask ${title}` },
            });

            return res.status(200).send({
                success: true,
                task,
            });
        } catch (error: any) {
            console.error(error);
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// update subtask
export const updateSubTask = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { taskId, subtaskId } = req.params;
            const { completed } = req.body;

            const task = await Task.findById(taskId);

            if (!task) {
                return next(new ErrorHandler('Task not found', 404));
            }

            const project = await Project.findById(task.project).populate(
                'members.user',
                'name profilePicture'
            );

            if (!project) {
                return next(new ErrorHandler('Project not found', 404));
            }

            const isMember = project.members.some(
                (member) => member?.user?._id.toString() === req?.user?._id.toString()
            );

            if (!isMember) {
                return next(new ErrorHandler('You are not a memeber of this project', 403));
            }

            const subTask = task.subtasks.find(
                (subTask: { _id: string }) => subTask?._id?.toString() === subtaskId
            );

            if (!subTask) {
                return next(new ErrorHandler('Subtask not found', 404));
            }

            subTask.completed = completed;
            await task.save();

            await recordActivity({
                userId: req?.user?._id,
                action: 'UPDATED_SUBTASK',
                resourceType: 'TASK',
                resourceId: taskId,
                details: { description: `updated subtask ${subTask.title}` },
            });

            return res.status(200).send({
                success: true,
                task,
            });
        } catch (error: any) {
            console.error(error);
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// get activity by resourceId
export const getActivityLogByResourceId = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { resourceId } = req.params;

            const activities = await ActivityLog.find({ resourceId })
                .populate('user', 'name profilePicture')
                .sort({ createdAt: -1 });

            if (!activities) {
                return next(new ErrorHandler('Activity log not found', 404));
            }

            return res.status(200).send({
                success: true,
                activities,
            });
        } catch (error: any) {
            console.error(error);
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// added comment
export const addedComment = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { taskId } = req.params;
            const { text } = req.body;

            const task = await Task.findById(taskId);

            if (!task) {
                return next(new ErrorHandler('Task not found', 404));
            }

            const project = await Project.findById(task.project).populate(
                'members.user',
                'name profilePicture'
            );

            if (!project) {
                return next(new ErrorHandler('Project not found', 404));
            }

            const isMember = project.members.some(
                (member) => member?.user?._id.toString() === req?.user?._id.toString()
            );

            if (!isMember) {
                return next(new ErrorHandler('You are not a memeber of this project', 403));
            }

            const newComment = await Comment.create({
                text,
                task: taskId,
                author: req?.user?._id,
            });

            task.comments.push(newComment?._id);
            await task.save();

            await recordActivity({
                userId: req?.user?._id,
                action: 'ADDED_COMMENT',
                resourceType: 'TASK',
                resourceId: taskId,
                details: {
                    description: `added comment ${text.substring(0, 50) + (text.length > 50 ? '...' : '')}`,
                },
            });

            return res.status(200).send({
                success: true,
                newComment,
            });
        } catch (error: any) {
            console.error(error);
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// get comments by  taskId
export const getCommentsByTaskId = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { taskId } = req.params;

            const comments = await Comment.find({ task: taskId })
                .populate('author', 'name profilePicture')
                .sort({ createdAt: -1 });

            return res.status(200).send({
                success: true,
                comments,
            });
        } catch (error: any) {
            console.error(error);
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// toggle watch task
export const toggleWatchTask = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { taskId } = req.params;

            const task = await Task.findById(taskId);

            if (!task) {
                return next(new ErrorHandler('Task not found', 404));
            }

            const project = await Project.findById(task.project).populate(
                'members.user',
                'name profilePicture'
            );

            if (!project) {
                return next(new ErrorHandler('Project not found', 404));
            }

            const isMember = project.members.some(
                (member) => member?.user?._id.toString() === req?.user?._id.toString()
            );

            if (!isMember) {
                return next(new ErrorHandler('You are not a memeber of this project', 403));
            }

            const isWatching = task.watchers.includes(req?.user?._id);

            if (!isWatching) {
                task.watchers.push(req?.user?._id);
            } else {
                task.watchers = task.watchers.filter(
                    (watcher: string) => watcher?.toString() !== req?.user?._id.toString()
                );
            }

            await task.save();

            // record activity
            await recordActivity({
                userId: req?.user?._id,
                action: 'UPDATED_TASK',
                resourceType: 'TASK',
                resourceId: taskId,
                details: {
                    description: `${isWatching ? 'stopped watching' : 'started watching'} task ${task.title}`,
                },
            });

            return res.status(200).send({
                success: true,
                isWatching,
                task,
            });
        } catch (error: any) {
            console.error(error);
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// toggle archive task
export const toggleArchiveTask = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { taskId } = req.params;

            const task = await Task.findById(taskId);

            if (!task) {
                return next(new ErrorHandler('Task not found', 404));
            }

            const project = await Project.findById(task.project).populate(
                'members.user',
                'name profilePicture'
            );

            if (!project) {
                return next(new ErrorHandler('Project not found', 404));
            }

            const isMember = project.members.some(
                (member) => member?.user?._id.toString() === req?.user?._id.toString()
            );

            if (!isMember) {
                return next(new ErrorHandler('You are not a memeber of this project', 403));
            }

            const isArchived = task.isArchived;

            task.isArchived = !isArchived;
            await task.save();

            // record activity
            await recordActivity({
                userId: req?.user?._id,
                action: 'UPDATED_TASK',
                resourceType: 'TASK',
                resourceId: taskId,
                details: {
                    description: `${isArchived ? 'unarchived' : 'archived'} task ${task.title}`,
                },
            });

            return res.status(200).send({
                success: true,
                isArchived,
                task,
            });
        } catch (error: any) {
            console.error(error);
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// get my task
export const getMyTasks = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { workspaceId } = req.query;
            console.log('workspaceId', workspaceId);

            if (workspaceId) {
                const projectIds = await Project.find({
                    workspace: new Types.ObjectId(workspaceId as string),
                }).select('_id');

                const ids = projectIds.map((p) => p?._id);

                console.log('projects ids', projectIds);

                const tasks = await Task.find({
                    project: { $in: ids },
                    assignees: { $in: [req?.user?._id] },
                })
                    .populate('project', 'title workspace')
                    .sort({ createdAt: -1 });

                console.log('Tasks', tasks);

                return res.status(200).send({
                    success: true,
                    tasks,
                });
            } else {
                const tasks = await Task.find({
                    assignees: { $in: [req?.user?._id] },
                })
                    .populate('project', 'title workspace')
                    .sort({ createdAt: -1 });

                return res.status(200).send({
                    success: true,
                    tasks,
                });
            }
        } catch (error: any) {
            console.error(error);
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// delete task
export const deleteTask = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { taskId } = req.params;

            const task = await Task.findById(taskId).populate('project', '_id members');

            if (!task) {
                return next(new ErrorHandler('Task not found', 404));
            }

            const title = task?.title;

            const isMember = task?.project?.members.find(
                (member: any) => member?.user.toString() === req?.user?._id.toString()
            );

            if (!isMember) {
                return next(new ErrorHandler('You are not a member of this task', 403));
            }

            if (isMember?.role !== 'MANAGER') {
                return next(new ErrorHandler('You are not authorized to delete the task', 409));
            }

            // remove task id from project
            await Project.updateOne({ _id: task?.project?._id }, { $pull: { tasks: taskId } });

            // delete all comments
            await Comment.deleteMany({ task: taskId });

            // delete task
            await Task.deleteOne({ _id: taskId });

            return res.status(200).send({
                success: true,
                message: `Task "${title}" deleted successfully`,
                title,
            });
        } catch (error: any) {
            console.error('Delete Task Error :', error);
            return next(new ErrorHandler(error.message, 500));
        }
    }
);
