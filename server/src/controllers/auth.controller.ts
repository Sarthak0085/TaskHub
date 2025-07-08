import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';

import { catchAsyncError } from '../middleware/catchAsyncError.js';
import ErrorHandler from '../utils/ErrorHandler.js';
import User from '../models/user.model.js';
import Verification from '../models/verification.model.js';
import sendEmail from '../utils/send-mail.js';

// Register
export const register = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return next(new ErrorHandler('User already exist', 400));
        }

        const hashPassword = await bcrypt.hash(password, 16);

        // const newUser = await User.create({
        //     name,
        //     email,
        //     password: hashPassword,
        // });

        const verificationToken = jwt.sign(
            {
                user: { name: name, email: email, password: hashPassword },
                purpose: 'Email-Verification',
            },
            process.env.JWT_SECRET!,
            { expiresIn: '1h' }
        );

        // await Verification.create({
        //     userId: newUser?._id,
        //     token: verificationToken,
        //     expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000),
        // });

        const verificationLink = `${process.env.FRONTEND_URL}/auth/verify-email?token=${verificationToken}`;

        await sendEmail({
            email: email,
            subject: 'Verify your email',
            template: 'verify-email.ejs',
            cloudinaryCode: 'v1751719802',
            data: {
                name: name,
                confirmLink: verificationLink,
            },
        });

        res.status(201).send({
            success: true,
            message: 'Verification Email sent to your email. Please check and verify your account.',
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// login user
export const login = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return next(new ErrorHandler('Invalid email or password', 400));
        }

        if (user?.isEmailVerified === false) {
            return next(new ErrorHandler('Please verify your email first', 400));
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return next(new ErrorHandler('Invalid email or password', 400));
        }

        if (user.is2FAEnabled === true) {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const expires = new Date(Date.now() + 10 * 60 * 1000);

            user.twoFAOtp = otp;
            user.twoFAOtpExpires = expires;
            await user.save();

            const tempToken = jwt.sign(
                { userId: user?._id, purpose: '2fa' },
                process.env.JWT_SECRET!,
                { expiresIn: '5m' }
            );

            await sendEmail({
                email: email,
                subject: 'Your 2FA OTP Code',
                template: 'two-factor-enabled-code.ejs',
                cloudinaryCode: 'v1751881841',
                data: {
                    name: user?.name,
                    twoFactorOtp: otp,
                },
            });

            res.status(200).send({
                success: true,
                message: 'Otp sent to your email. Enter otp to login.',
                requires2FA: true,
                token: tempToken,
            });
        } else {
            const token = jwt.sign(
                { userId: user._id, purpose: 'login' },
                process.env.JWT_SECRET!,
                { expiresIn: '7d' }
            );

            user.lastLogin = new Date();
            await user.save();

            const userData = user.toObject() as Record<string, any>;
            delete userData.password;

            res.status(200).send({
                message: 'Login successful',
                token,
                user: userData,
            });
        }
    } catch (error: any) {
        console.error('Login Error :', error);
        return next(new ErrorHandler(error.message, 500));
    }
});

// verify two factor otp
export const verify2FAEnabled = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { token, otp } = req.body;
            console.log(token, otp);
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

            if (!decoded) {
                return next(new ErrorHandler('Token Expired', 401));
            }

            if (decoded.purpose !== '2fa') {
                return next(new ErrorHandler('Invalid token purpose', 400));
            }

            const user = await User.findById(decoded.userId).select(
                '_id name email isEmailVerified profilePicture twoFAOtp twoFAOtpExpires'
            );
            console.log('user', user);

            if (!user) {
                return next(new ErrorHandler('User not found', 404));
            }

            if (!user.is2FAEnabled && user.twoFAOtpExpires < new Date()) {
                return next(new ErrorHandler('Otp Expired please login again', 400));
            }

            if (user.twoFAOtp.toString() !== otp.toString()) {
                return next(new ErrorHandler('Invalid OTP. Please enter the correct otp', 403));
            }

            user.twoFAOtp = '';
            user.twoFAOtpExpires = new Date(0);
            user.lastLogin = new Date();
            await user.save();

            const loginToken = jwt.sign(
                { userId: user._id, purpose: 'login' },
                process.env.JWT_SECRET!,
                { expiresIn: '7d' }
            );

            const userData = user.toObject() as Record<string, any>;
            delete userData.password;

            res.status(200).send({
                message: 'Login successful',
                token: loginToken,
                user: userData,
            });
        } catch (error: any) {
            console.error('Verify 2FA Error :', error);
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// Verify Email
export const verifyEmail = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { token } = req.body;

            const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

            if (!payload) {
                return next(new ErrorHandler('Unauthorized', 401));
            }

            const { user, purpose } = payload;
            console.log('name :', user?.name, 'email :', user?.email, 'password :', user?.password);

            if (purpose !== 'Email-Verification') {
                return next(new ErrorHandler('Unauthorized', 401));
            }

            // Check if user already exists
            const existingUser = await User.findOne({ email: user?.email });
            console.log(existingUser, ' , existing user');
            if (existingUser) {
                return next(new ErrorHandler('User already verified. Please log in.', 400));
            }

            // Create user from token payload
            await User.create({
                name: user?.name,
                email: user?.email,
                password: user?.password,
                isEmailVerified: true,
            });

            res.status(201).send({
                success: true,
                message: 'Email verified successfully. You can now log in.',
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// forgot password
export const forgotPassword = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email } = req.body;

            const user = await User.findOne({ email });

            if (!user) {
                return next(new ErrorHandler('User not found', 404));
            }

            if (!user.isEmailVerified) {
                return next(new ErrorHandler('Please verify your email first', 400));
            }

            const existingVerification = await Verification.findOne({ userId: user._id });

            if (existingVerification && existingVerification.expiresAt > new Date()) {
                return next(new ErrorHandler('Reset Password request already sent', 400));
            }

            if (existingVerification && existingVerification.expiresAt < new Date()) {
                await Verification.findByIdAndDelete(existingVerification._id);
            }

            const resetPasswordToken = jwt.sign(
                { userId: user._id, purpose: 'reset-password' },
                process.env.JWT_SECRET!,
                { expiresIn: '15m' }
            );

            await Verification.create({
                userId: user._id,
                token: resetPasswordToken,
                expiresAt: new Date(Date.now() + 15 * 60 * 1000),
            });

            const resetPasswordLink = `${process.env.FRONTEND_URL}/auth/reset-password?token=${resetPasswordToken}`;

            await sendEmail({
                email: email,
                subject: 'Reset your password',
                template: 'reset-password.ejs',
                cloudinaryCode: 'v1751719802',
                data: {
                    name: user?.name,
                    confirmLink: resetPasswordLink,
                },
            });

            res.status(200).send({ success: true, message: 'Reset password email sent' });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// Reset Password
export const resetPassword = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { token, newPassword, confirmPassword } = req.body;

            const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

            if (!payload) {
                return next(new ErrorHandler('Unauthorized', 401));
            }

            const { userId, purpose } = payload;

            if (purpose !== 'reset-password') {
                return next(new ErrorHandler('Unauthorized', 401));
            }

            const verification = await Verification.findOne({
                userId,
                token,
            });

            if (!verification) {
                return next(new ErrorHandler('Unauthorized', 401));
            }

            const isTokenExpired = verification.expiresAt < new Date();

            if (isTokenExpired) {
                return next(new ErrorHandler('Token Expired', 401));
            }

            const user = await User.findById(userId);

            if (!user) {
                return next(new ErrorHandler('User not found', 404));
            }

            const hashPassword = await bcrypt.hash(newPassword, 16);

            user.password = hashPassword;
            await user.save();

            await Verification.findByIdAndDelete(verification._id);

            res.status(200).send({ success: true, message: 'Password reset successfully' });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);
