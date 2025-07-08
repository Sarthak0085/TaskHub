import { Types, Schema, model, Document } from 'mongoose';

export interface IProject extends Document {
    _id: Types.ObjectId;
    title: string;
    description?: string;
    workspace: Types.ObjectId;
    status: 'PLANNING' | 'IN PROGRESS' | 'ON HOLD' | 'COMPLETED' | 'CANCELLED';
    startDate?: Date;
    dueDate?: Date;
    progress: number;
    tasks: Types.ObjectId[];
    members: { user: Types.ObjectId; role: 'MANAGER' | 'CONTRIBUTOR' | 'VIEWER' }[];
    tags?: string[];
    createdBy: Types.ObjectId;
    isArchived: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
    {
        title: {
            type: String,
            trim: true,
            required: true,
        },
        description: {
            type: String,
            trim: true,
        },
        workspace: {
            type: Schema.Types.ObjectId,
            ref: 'Workspace',
            required: true,
        },
        status: {
            type: String,
            enum: ['PLANNING', 'IN PROGRESS', 'ON HOLD', 'COMPLETED', 'CANCELLED'],
            default: 'PLANNING',
        },
        startDate: {
            type: Date,
        },
        dueDate: {
            type: Date,
        },
        progress: {
            type: Number,
            min: 0,
            max: 0,
            default: 0,
        },
        tasks: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Task',
            },
        ],
        members: [
            {
                user: {
                    type: Schema.Types.ObjectId,
                    ref: 'User',
                },
                role: {
                    type: String,
                    enum: ['MANAGER', 'CONTRIBUTOR', 'VIEWER'],
                    default: 'CONTRIBUTOR',
                },
            },
        ],
        tags: [{ type: String }],
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        isArchived: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const Project = model<IProject>('Project', projectSchema);

export default Project;
