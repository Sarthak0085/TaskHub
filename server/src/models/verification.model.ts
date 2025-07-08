import { Types, Schema, model } from 'mongoose';

export interface IVerfication extends Document {
    userId: Types.ObjectId;
    token: string;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const verificationSchema = new Schema<IVerfication>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        token: {
            type: String,
            required: true,
        },
        expiresAt: {
            type: Date,
            required: true,
        },
    },
    { timestamps: true }
);

const Verification = model<IVerfication>('Verification', verificationSchema);

export default Verification;
