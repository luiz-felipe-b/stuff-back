import { HttpError } from "./http.error";

export class NotFoundError extends HttpError {
    constructor(message: string = "Resource couldn't be found", statusCode: number = 404) {
        super('NotFoundError', message, statusCode);
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}