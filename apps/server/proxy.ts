import type { Response, Request, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export function authProxy(req: Request, res: Response, next: NextFunction) {
    const tk = req.cookies.token

    if (!tk) {
        res.status(401).send("Not Authenticated!")
        return
    }

    try {
        const payload = jwt.verify(tk, process.env.JWT_SECRET!)
        req.userId = payload.sub as string
        next()
    } catch (err) {
        return res.status(403).json({ error: "Invalid or expired token" })
    }
}