import mongoose, { Schema, Types, Document } from 'mongoose';

export interface IActivityLog extends Document {
    user: Types.ObjectId;
    action:
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
        | 'TRANSFERRED_WORKSPACE_OWNERSHIP'
        | 'ADDED_ATTACHMENT';
    resourceType: 'TASK' | 'PROJECT' | 'WORKSPACE' | 'COMMENT' | 'USER';
    resourceId: Types.ObjectId;
    details?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}

const activityLogSchema = new Schema<IActivityLog>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        action: {
            type: String,
            required: true,
            enum: [
                'CREATED_TASK',
                'UPDATED_TASK',
                'CREATED_SUBTASK',
                'UPDATED_SUBTASK',
                'COMPLETED_TASK',
                'CREATED_PROJECT',
                'UPDATED_PROJECT',
                'COMPLETED_PROJECT',
                'CREATED_WORKSPACE',
                'UPDATED_WORKSPACE',
                'ADDED_COMMENT',
                'ADDED_MEMBER',
                'REMOVED_MEMBER',
                'JOINED_WORKSPACE',
                'TRANSFERRED_WORKSPACE_OWNERSHIP',
                'ADDED_ATTACHMENT',
            ],
        },
        resourceType: {
            type: String,
            required: true,
            enum: ['TASK', 'PROJECT', 'WORKSPACE', 'COMMENT', 'USER'],
        },
        resourceId: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        details: {
            type: Object,
        },
    },
    { timestamps: true }
);

const ActivityLog =
    mongoose.models.ActivityLog || mongoose.model<IActivityLog>('ActivityLog', activityLogSchema);

export default ActivityLog;
