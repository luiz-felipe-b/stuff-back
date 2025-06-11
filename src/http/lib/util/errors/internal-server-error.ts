import { HttpError } from "./http.error";

export class InternalServerError extends HttpError {
    constructor(message: string = 'Internal server error', statusCode: number = 500) {
        super('InternalServerError', message, statusCode);
        Object.setPrototypeOf(this, InternalServerError.prototype);
    }
} 