import jwt, { type JwtPayload } from 'jsonwebtoken';

const jwt_secret = process.env.JWT_SECRET!

interface AppJwtPayload extends JwtPayload {
    userId: string,
}

export function generateToken(id: string) {
    return jwt.sign({
        userId: id,
    }, jwt_secret, {
        expiresIn: '1h'
    })
}

export function validateToken(token: string): AppJwtPayload {
    return jwt.verify(token, jwt_secret) as AppJwtPayload
}
