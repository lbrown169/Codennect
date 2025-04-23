import { Response as ExpressResponse } from 'express';
import { User } from './domain/User.js';

export function isProd() {
    return process.env.NODE_ENV === 'production';
}

export function getVersion() {
    return process.env.VERSION;
}

export function buildUrl(path: string) {
    if (isProd()) {
        return 'https://cop4331.tech' + path;
    } else {
        return 'http://localhost:5001' + path;
    }
}
interface Locals extends Record<string, any> {
    user?: User;
}

export interface Response extends ExpressResponse {
    locals: Locals;
}
