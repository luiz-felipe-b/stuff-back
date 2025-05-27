import { ErrorResponse } from "../../../../types/http/responses";

export class HttpError extends Error implements ErrorResponse {
    public statusCode: number;
    public error: string;

    constructor(error: string | undefined = 'HttpError', message: string | undefined = '', statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.error = error;

        Object.setPrototypeOf(this, HttpError.prototype);
    }
}
