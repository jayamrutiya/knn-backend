/* eslint-disable @typescript-eslint/no-explicit-any */
import { GeneralError } from './GeneralError';

export class BadRequest extends GeneralError {
    errors?: any;

    constructor(message: string, errors?: any) {
        super(400, 'Bad Request', message);
        this.errors = errors;
        Error.captureStackTrace(this, this.constructor);
    }

    toJSON() {
        return {
            code: this.code,
            status: this.status,
            message: this.message,
            errors: this.errors,
        };
    }
}
