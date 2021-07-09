"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFound = void 0;
const GeneralError_1 = require("./GeneralError");
class NotFound extends GeneralError_1.GeneralError {
    constructor(message) {
        super(404, 'Not Found', message);
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.NotFound = NotFound;
