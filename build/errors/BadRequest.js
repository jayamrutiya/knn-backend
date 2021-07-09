"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadRequest = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const GeneralError_1 = require("./GeneralError");
class BadRequest extends GeneralError_1.GeneralError {
    constructor(message, errors) {
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
exports.BadRequest = BadRequest;
