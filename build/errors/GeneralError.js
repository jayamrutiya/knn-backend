"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneralError = void 0;
class GeneralError extends Error {
    constructor(code, status, message) {
        super(message);
        this.code = code;
        this.status = status;
        Error.captureStackTrace(this, this.constructor);
    }
    getCode() {
        return this.code;
    }
    toJSON() {
        return {
            code: this.code,
            status: this.status,
            message: this.message,
        };
    }
}
exports.GeneralError = GeneralError;
