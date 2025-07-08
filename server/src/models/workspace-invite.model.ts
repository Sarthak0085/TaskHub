import mongoose, { Document, Types } from 'mongoose';

interface IWorkspaceInvite extends Document {
    user: Types.ObjectId;
    workspace: Types.ObjectId;
    token: string;
    role: 'ADMIN' | 'MEMBER' | 'VIEWER';
    expiresAt: Date;
}

const workspaceInviteSchema = new mongoose.Schema<IWorkspaceInvite>(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        workspace: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Workspace',
            required: true,
        },
        token: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ['ADMIN', 'MEMBER', 'VIEWER'],
            default: 'MEMBER',
        },
        expiresAt: {
            type: Date,
            required: true,
        },
    },
    { timestamps: true }
);

const WorkspaceInvite =
    mongoose.models.WorkspaceInvite ||
    mongoose.model<IWorkspaceInvite>('WorkspaceInvite', workspaceInviteSchema);

export default WorkspaceInvite;
