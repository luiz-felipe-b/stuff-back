import { HttpError } from "./http.error";

export class BadRequestError extends HttpError {
    constructor(message: string = 'Request was malformed', statusCode: number = 400) {
        super('BadRequestError', message, statusCode);
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }
}