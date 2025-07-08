import { NextFunction, Request, Response } from 'express';
import { catchAsyncError } from '../middleware/catchAsyncError.js';
import ErrorHandler from '../utils/ErrorHandler.js';
import Workspace from '../models/workspace.model.js';
import Project from '../models/project.model.js';
import Task from '../models/task.model.js';
import Comment from '../models/comment.model.js';

// create project
export const createProject = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { workspaceId } = req.params;
            const { title, description, status, startDate, dueDate, tags, members } = req.body;

            const workspace = await Workspace.findById(workspaceId);

            if (!workspace) {
                return next(new ErrorHandler('Workspace not found', 404));
            }

            const isMember = workspace.members.some(
                (member) => member?.user.toString() === req?.user?._id.toString()
            );

            if (!isMember) {
                return next(new ErrorHandler('You are not a member of this workspace', 403));
            }

            const tagArray = tags ? tags.split(',') : [];

            const newProject = await Project.create({
                title,
                description,
                tags: tagArray,
                startDate,
                dueDate,
                status,
                workspace: workspaceId,
                members,
                createdBy: req?.user?._id,
            });

            workspace.projects.push(newProject?._id);
            await workspace.save();

            console.log(newProject, 'new');

            return res.status(200).send({
                success: true,
                newProject,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// get project details
export const getProjectDetails = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { projectId } = req.params;

            const project = await Project.findById(projectId);

            if (!project) {
                return next(new ErrorHandler('Project not found', 404));
            }

            const isMember = project.members.some(
                (member) => member?.user.toString() === req?.user?._id?.toString()
            );

            if (!isMember) {
                return next(new ErrorHandler('You are not a member of this project', 403));
            }

            return res.status(200).send({
                success: true,
                project,
            });
        } catch (error: any) {
            console.error(error);
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// get project tasks
export const getProjectTasks = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { projectId } = req.params;

            const project = await Project.findById(projectId).populate('members.user');

            if (!project) {
                return next(new ErrorHandler('Project not found', 404));
            }

            const isMember = project.members.some(
                (member) => member.user?._id.toString() === req?.user?._id.toString()
            );

            if (!isMember) {
                return next(new ErrorHandler('You are not a member of this project', 403));
            }

            const tasks = await Task.find({
                project: projectId,
                isArchived: false,
            })
                .populate('assignees', 'name profilePicture')
                .sort({ createdAt: -1 });

            return res.status(200).send({
                success: true,
                project,
                tasks,
            });
        } catch (error: any) {
            console.error(error);
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// update project
export const updateProject = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { projectId } = req.params;
            const { title, description, status, startDate, dueDate, tags } = req.body;

            const tagArray = tags ? tags.split(',') : [];

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

            if (!isMember) {
                return next(new ErrorHandler('You are not a member of this project', 403));
            }

            project.title = title;
            if (description !== 'undefined') project.description = description;
            if (tags !== 'undefined') project.tags = tagArray;
            project.startDate = startDate;
            if (dueDate !== 'undefined') project.dueDate = dueDate;
            project.status = status;

            await project.save();

            return res.status(200).send({
                success: true,
                message: 'Project updated successfully',
                project,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// update project
export const deleteProject = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { projectId } = req.params;

            const project = await Project.findById(projectId);

            if (!project) {
                return next(new ErrorHandler('Project not found', 404));
            }

            const isMember = project.members.find(
                (member) => member?.user.toString() === req?.user?._id.toString()
            );

            if (!isMember) {
                return next(new ErrorHandler('You are not a member of this project', 403));
            }

            if (isMember?.role !== 'MANAGER') {
                return next(new ErrorHandler('You are not authorized to delete the project', 409));
            }

            const workspace = await Workspace.findById(project?.workspace);

            if (!workspace) {
                return next(new ErrorHandler('Workspace not found', 404));
            }

            const title = project?.title;

            // remove project id from workspace
            await Workspace.updateOne(
                { _id: project.workspace },
                { $pull: { projects: projectId } }
            );

            // get all the tasks related to project
            const tasks = await Task.find({ project: projectId }).select('_id');
            const taskIds = tasks.map((task) => task?._id);

            // delete all comments related to tasks
            await Comment.deleteMany({ task: { $in: taskIds } });

            // delete all tasks related to  project
            await Task.deleteMany({ project: { $in: projectId } });

            // delete the project
            await Project.findByIdAndDelete(projectId);

            return res.status(200).send({
                success: true,
                message: `Project "${title}" deleted successfully`,
                title,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);
