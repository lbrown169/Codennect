import { NextFunction } from 'express'
import { Response } from '../utils.js'
import { Request } from 'express'
import jwt from 'jsonwebtoken'

interface JwtPayload {
    _id: string
}

export default async function (
    req: Request,
    res: Response,
    next: NextFunction
) {
    res.locals.user = undefined
    const token = req.headers['authorization']

    if (token) {
        try {
            const decoded = jwt.verify(token, req.app.locals.key) as JwtPayload
            res.locals.user =
                await req.app.locals.driver.userRepository.GetById(decoded._id)
        } catch (err) {
            res.clearCookie('token')
        }
    }

    next()
}
