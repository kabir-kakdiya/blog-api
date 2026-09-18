import type { Response } from "express";
import { flatten, type BaseIssue } from "valibot";

export interface ApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data?: T;
    errors?: Record<string, string> | unknown;
}

/**
 * Sends a successful JSON response (Default status 200 OK or 201 Created)
 */
export function sendSuccess<T>(res: Response, data?: T, message = "Operation successful", statusCode = 200) {
    const body: ApiResponse<T> = { success: true, message, }
    if (data !== undefined) {
        body.data = data
    }
    return res.status(statusCode).json(body);
}

/**
 * Sends a generic error response (Default status 400 Bad Request)
 */
export function sendError(res: Response, message = "An error occurred", statusCode = 400, errors?: unknown) {
    return res.status(statusCode).json({
        success: false,
        message,
        errors,
    } satisfies ApiResponse);
}

/**
 * Converts Valibot issues into a clean `{ [field]: "error message" }` map
 */
export function sendValidationError(res: Response, issues: [BaseIssue<unknown>, ...BaseIssue<unknown>[]], message = "Validation failed") {
    const { nested } = flatten(issues);
    return sendError(res, message, 422, nested);
}