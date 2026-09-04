import type { Response } from "express";

interface ApiSuccessResponse<T> {
    success: true;
    message: string;
    data: T;
}

interface ApiErrorResponse {
    success: false;
    message: string;
    error?: string;
}

export function sendSuccess<Type>(
    res: Response,
    data: Type,
    message = "success",
    status = 200
): Response<ApiSuccessResponse<Type>> {
    return res.status(status).json({
        success: true,
        data,
        message
    });
}

export function sendError(
    res: Response,
    message = "Something went wrong",
    status = 500,
    error?: string
): Response<ApiErrorResponse> {
    return res.status(status).json({
        success: false,
        message,
        error,
    });
}