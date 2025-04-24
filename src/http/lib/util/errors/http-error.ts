import { ErrorResponse } from "../../../../types/http/responses";

export class HttpError extends Error implements ErrorResponse {
    public statusCode: number;
    public error: string;

    constructor(error: string | undefined = 'HttpError', statusCode: number, message: string | undefined = '') {
        super(message);
        this.statusCode = statusCode;
        this.error = error;

        Object.setPrototypeOf(this, HttpError.prototype);
    }
}
