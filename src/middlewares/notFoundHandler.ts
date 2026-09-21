import type { RequestHandler } from "express";
import { NotFoundError } from "../lib/Errors.ts";

const notFoundHandler: RequestHandler = (req, _) => {
    throw new NotFoundError(`Route ${req.method} ${req.originalUrl} not found`);
}

export default notFoundHandler;