import { Types, Schema, model } from 'mongoose';

interface IWorkspace extends Document {
    name: string;
    description?: string;
    color: string;
    owner: Types.ObjectId;
    members: {
        user: Types.ObjectId;
        role: 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';
        joinedAt: Date;
    }[];
    projects: Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const workspaceSchema = new Schema<IWorkspace>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        color: {
            type: String,
            default: '#FF5733',
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        members: [
            {
                user: { type: Schema.Types.ObjectId, ref: 'User' },
                role: {
                    type: String,
                    enum: ['OWNER', 'ADMIN', 'MEMBER', 'VIEWER'],
                    default: 'MEMBER',
                },
                joinedAt: { type: Date, default: Date.now() },
            },
        ],
        projects: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Project',
            },
        ],
    },
    { timestamps: true }
);

const Workspace = model<IWorkspace>('Workspace', workspaceSchema);

export default Workspace;
