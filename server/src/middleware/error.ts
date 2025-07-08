import { NextFunction, Request, Response } from 'express';
import ErrorHandler from '../utils/ErrorHandler.js';

export const ErrorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'Internal Server Error';

    // Wrong MongoDB Id Error
    if (err.name === 'CastError') {
        const message = `Resources not found. Invalid: ${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    // Duplicate Key Error
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} found.`;
        err = new ErrorHandler(message, 429);
    }

    // Wrong JWT Error
    if (err.name === 'JsonWebTokenError') {
        const message = 'Json Web Token entered is invalid. Try Again.';
        err = new ErrorHandler(message, 400);
    }

    // jwt token expired
    if (err.name === 'TokenExpiredError') {
        const message = `Json web token is expired. Try again`;
        err = new ErrorHandler(message, 400);
    }

    res.status(err.statusCode).send({
        success: false,
        message: err.message,
    });
};
