import type { ErrorRequestHandler } from "express";
import { sendError } from "../lib/response.helpers.ts";
import { AppError } from "../lib/Errors.ts";

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if (res.headersSent) return next(err);

    const isDev = process.env.NODE_ENV === "development";
    const statusCode = err.statusCode ?? 500;
    const isOperational = err instanceof AppError && err.isOperational;

    if (!isOperational) {
        console.error(`[${req.method}] ${req.originalUrl} ->`, err);
    }

    const message = isOperational || isDev
        ? err.message || "Something went wrong"
        : "Internal server error";

    const errors = isDev
        ? { stack: err.stack }
        : undefined;

    return sendError(res, message, statusCode, errors);
};

export default errorHandler