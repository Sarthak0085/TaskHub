import { Request } from 'express';
import { IUser } from '../models/user.model.ts';

declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}
