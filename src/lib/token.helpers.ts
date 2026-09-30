import jwt, { type JwtPayload } from "jsonwebtoken";

import env from "../env.ts";

const jwt_secret = env.JWT_SECRET;

interface AppJwtPayload extends JwtPayload {
    userId: string;
}

export function generateToken(id: string) {
    return jwt.sign(
        {
            userId: id,
        },
        jwt_secret,
        {
            expiresIn: "2h",
        },
    );
}

export function validateToken(token: string): AppJwtPayload {
    return jwt.verify(token, jwt_secret) as AppJwtPayload;
}
