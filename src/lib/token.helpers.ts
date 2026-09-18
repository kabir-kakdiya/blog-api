import jwt from 'jsonwebtoken';

const jwt_secret = process.env.JWT_SECRET!

export function generateToken(id: string) {
    return jwt.sign({
        userId: id,
    }, jwt_secret, {
        expiresIn: '1h'
    })
}

export function validateToken(token: string) {
    return jwt.verify(token, jwt_secret)
}
