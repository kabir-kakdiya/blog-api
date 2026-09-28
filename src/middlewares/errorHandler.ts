import type { ErrorRequestHandler } from "express";

import env from "../env.ts";
import { AppError } from "../lib/Errors.ts";
import { sendError } from "../lib/response.helpers.ts";

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if (res.headersSent) return next(err);

    const isDev = env.NODE_ENV;
    const statusCode = err.statusCode ?? 500;
    const isOperational = err instanceof AppError && err.isOperational;

    if (!isOperational) {
        console.error(`[${req.method}] ${req.originalUrl} ->`, err);
    }
    const message =
        isOperational || isDev ? err.message || "Something went wrong" : "Internal server error";

    const errors = isDev ? { stack: err.stack } : undefined;

    return sendError(res, message, statusCode, errors);
};

export default errorHandler;
