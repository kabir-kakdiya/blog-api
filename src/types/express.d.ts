// types/express.d.ts
export { };

interface UserPayload {
    
}

declare global {
    namespace Express {
        interface Response {

            sendSuccess<T>(data: T, message?: string, statusCode?: number): void;
            sendError(error: string, statusCode?: number): void;
        }
    }
}
