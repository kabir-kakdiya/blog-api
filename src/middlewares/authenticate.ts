import type { RequestHandler } from "express";
import { UnauthorizedError } from "../lib/Errors.ts";
import { validateToken } from "../lib/token.helpers.ts";

const authenticateUser: RequestHandler = (req, res, next) => {
    const authHeader = req.headers['authorization']

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedError()
    }

    const token = authHeader.split(' ')[1]!
    try {
        const decoded = validateToken(token);

        res.locals.userId = decoded.userId;
        next()
    } catch (error) {
        throw new UnauthorizedError(error instanceof Error ? error.message : undefined)
    }
}

export default authenticateUser