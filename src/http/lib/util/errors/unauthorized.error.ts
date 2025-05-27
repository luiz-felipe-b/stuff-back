import { HttpError } from "./http.error";

export class UnauthorizedError extends HttpError {
    constructor(message: string = 'User is unauthorized', statusCode: number = 404) {
        super('UnauthorizedError', message, statusCode);
        Object.setPrototypeOf(this, UnauthorizedError.prototype);
    }
}