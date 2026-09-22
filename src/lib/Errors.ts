export class AppError extends Error {

    constructor(message: string, public readonly statusCode = 500, public readonly isOperational = true) {
        super(message)
        this.name = this.constructor.name;
    }
}

export class NotFoundError extends AppError {
    constructor(message = 'Resource not found') {
        super(message, 404)
    }
}
