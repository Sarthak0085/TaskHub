import { NextFunction, Request, Response } from 'express';
import { catchAsyncError } from '../middleware/catchAsyncError.js';
import ErrorHandler from '../utils/ErrorHandler.js';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { deleteFileFromCloudinary, uploadFileToCloudinary } from '../utils/cloudinary.js';

// get user profile
export const getUserProfile = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await User.findById(req?.user?._id).select('-password');

            if (!user) {
                return next(new ErrorHandler('User not found', 404));
            }

            return res.status(200).send({
                success: true,
                user,
            });
        } catch (error: any) {
            console.error('Get User Profile Error :', error);
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// update user profile
export const updateUserProfile = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { name, profilePicture } = req.body;
            console.log('file', profilePicture);

            const user = await User.findById(req?.user?._id).select('-password');

            if (!user) {
                return next(new ErrorHandler('User not found', 404));
            }

            if (profilePicture) {
                if (user.profilePicture) {
                    await deleteFileFromCloudinary(user.profilePicture);

                    const file = await uploadFileToCloudinary(
                        profilePicture,
                        `taskhub/users/avatar`
                    );
                    user.profilePicture = file.url;
                } else {
                    const file = await uploadFileToCloudinary(
                        profilePicture,
                        `taskhub/users/avatar`
                    );
                    user.profilePicture = file.url;
                }
            }

            user.name = name;
            await user.save();

            return res.status(200).send({
                success: true,
                user,
            });
        } catch (error: any) {
            console.error('Get User Profile Error :', error);
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// toggle two factor Enabled
export const toggleTwoFactorEnabled = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await User.findById(req?.user?._id).select('-password');

            if (!user) {
                return next(new ErrorHandler('User not found', 404));
            }

            user.is2FAEnabled = !user.is2FAEnabled;
            if (!user.is2FAEnabled) {
                user.twoFAOtp = '';
                user.twoFAOtpExpires = new Date(0);
            }

            await user.save();

            return res.status(200).send({
                success: true,
                user,
            });
        } catch (error: any) {
            console.error('Get User Profile Error :', error);
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// get user profile
export const changePassword = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { currentPassword, newPassword, confirmPassword } = req.body;

            const user = await User.findById(req?.user?._id).select('+password');

            if (!user) {
                return next(new ErrorHandler('User not found', 404));
            }

            if (newPassword !== confirmPassword) {
                return next(
                    new ErrorHandler('New Password and Confirm Password must be same', 400)
                );
            }

            const isPasswordValid = await bcrypt.compare(user?.password, currentPassword);

            if (!isPasswordValid) {
                return next(new ErrorHandler('Invalid old password', 403));
            }

            const hashedPassword = await bcrypt.hash(newPassword, 16);

            user.password = hashedPassword;
            await user.save();

            return res.status(200).send({
                success: true,
                message: 'Password updated successfully',
            });
        } catch (error: any) {
            console.error('Change Password Error :', error);
            return next(new ErrorHandler(error.message, 500));
        }
    }
);
