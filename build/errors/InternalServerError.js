"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServerError = void 0;
const GeneralError_1 = require("./GeneralError");
class InternalServerError extends GeneralError_1.GeneralError {
    constructor(message) {
        super(500, 'Internal Server Error', message);
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.InternalServerError = InternalServerError;
