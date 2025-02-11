import { HttpError } from "../../../../util/errors/http-error";

export const organizationErrors = {
    MISSING_OR_INVALID_ID: new HttpError('Missing or invalid id', 400),
    MISSING_OR_INVALID_CODE: new HttpError('Missing or invalid code', 400),
    MISSING_OR_INVALID_DATA: new HttpError('Missing or invalid data', 400),
    ORGANIZATION_ALREADY_EXISTS: new HttpError('Organization already exists', 409),
} as const;
