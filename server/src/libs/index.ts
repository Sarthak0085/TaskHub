import { NextFunction } from 'express';
import ErrorHandler from '../utils/ErrorHandler.js';
import ActivityLog, { IActivityLog } from '../models/activity-log.model.js';

interface RecordActivityInput {
    userId?: string;
    action: IActivityLog['action'];
    resourceType: IActivityLog['resourceType'];
    resourceId: string;
    details?: Record<string, any>;
}

export const recordActivity = async ({
    userId,
    action,
    resourceType,
    resourceId,
    details,
}: RecordActivityInput): Promise<void> => {
    try {
        await ActivityLog.create({
            user: userId,
            action,
            resourceType,
            resourceId,
            details,
        });
    } catch (error: any) {
        console.error('Activity Log error : ', error);
    }
};
