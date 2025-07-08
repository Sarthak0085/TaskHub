import jwt, { JwtPayload } from 'jsonwebtoken';
import { catchAsyncError } from './catchAsyncError.js';
import { NextFunction, Request, Response } from 'express';
import ErrorHandler from '../utils/ErrorHandler.js';
import User from '../models/user.model.js';

export const isAuthenticated = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization?.split(' ')[1]; //Bearer dhghjhdkjfg

            if (!token) {
                return next(new ErrorHandler('Unauthorized', 401));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
            if (!decoded) {
                return next(new ErrorHandler('Unauthorized', 401));
            }

            const user = await User.findById(decoded.userId);

            if (!user) {
                return next(new ErrorHandler('Unauthorized', 401));
            }

            req.user = user;
            next();
        } catch (error: any) {
            console.log(error);
            return next(new ErrorHandler(error.message, 500));
        }
    }
);
