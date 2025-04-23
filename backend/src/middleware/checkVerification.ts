import { Response } from '../utils.js';
import { NextFunction, Request } from 'express';

export default async function checkVerification(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const user = res.locals.user;
    if (user?.verification) {
        res.status(412).json({ error: 'Active verification detected.' });
        return;
    }
    next();
}
