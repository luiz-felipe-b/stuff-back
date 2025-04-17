import { ErrorResponse } from "../../../../types/http/responses";

export class HttpError extends Error implements ErrorResponse {
    public statusCode: number;
    public error: string;

    constructor(message: string, statusCode: number, error: string | undefined = 'HttpError') {
        super(message);
        this.statusCode = statusCode;
        this.error = error;
    }
}
