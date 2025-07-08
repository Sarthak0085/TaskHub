import { model, Schema } from 'mongoose';

export interface IUser extends Document {
    _id: string;
    name: string;
    email: string;
    password: string;
    profilePicture?: string;
    isEmailVerified: boolean;
    lastLogin: Date;
    is2FAEnabled: boolean;
    twoFAOtp: string;
    twoFAOtpExpires: Date;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            trim: true,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            select: false,
        },
        profilePicture: {
            type: String,
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        lastLogin: {
            type: Date,
        },
        is2FAEnabled: {
            type: Boolean,
            default: false,
        },
        twoFAOtp: {
            type: String,
            select: false,
        },
        twoFAOtpExpires: {
            type: Date,
            select: false,
        },
    },
    { timestamps: true }
);

const User = model<IUser>('User', userSchema);

export default User;
