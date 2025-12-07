import type { Response } from 'express'
import jwt from 'jsonwebtoken'

interface JwtAuthProps {
    sub: string,
    res: Response
}

export const jwtAuth = ({ sub, res }: JwtAuthProps) => {
    const tk = jwt.sign({
        sub: sub
    }, process.env.JWT_SECRET!, {
        expiresIn: '30d'
    })

    res.cookie("token", tk, {
        httpOnly: true,
        sameSite: "strict",
        secure: true
    })
    return tk;
}
