import type { ErrorRequestHandler } from "express";
import { sendError } from "../lib/response.helpers.ts";

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if (res.headersSent) return next(err);
    console.log("Error handler called")
    const isDev = process.env.NODE_ENV === "development";
    const statusCode = err.statusCode ?? 500;

    if (statusCode >= 500) {
        console.error(`[${req.method}] ${req.originalUrl} ->`, err);
    }

    const message = statusCode >= 500 && !isDev
        ? "Internal server error"
        : err.message || "Something went wrong";

    const errors = isDev
        ? { stack: err.stack }
        : undefined;

    return sendError(res, message, statusCode, errors);
};
export default errorHandler