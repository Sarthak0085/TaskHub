import { model, Schema, Types } from 'mongoose';

interface IComment extends Document {
    text: string;
    task: Types.ObjectId;
    author: Types.ObjectId;
    mentions?: { user: Types.ObjectId; offset: number; length: number }[];
    reactions?: { emoji: string; user: Types.ObjectId }[];
    attachments?: { fileName: string; fileUrl: string; fileType: String; fileSize: number }[];
    isEdited: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
    {
        text: {
            type: String,
            trim: true,
            required: true,
        },
        task: {
            type: Schema.Types.ObjectId,
            ref: 'Task',
            required: true,
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        mentions: [
            {
                user: {
                    type: Schema.Types.ObjectId,
                    ref: 'User',
                },
                offset: {
                    type: Number,
                },
                length: {
                    type: Number,
                },
            },
        ],
        reactions: [
            {
                emoji: {
                    type: String,
                },
                user: {
                    type: Schema.Types.ObjectId,
                    ref: 'User',
                },
            },
        ],
        attachments: [
            {
                fileName: {
                    type: String,
                },
                fileType: {
                    type: String,
                },
                fileUrl: {
                    type: String,
                },
                fileSize: {
                    type: Number,
                },
            },
        ],
        isEdited: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const Comment = model<IComment>('Comment', commentSchema);

export default Comment;
