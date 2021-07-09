"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotImplemented = void 0;
const GeneralError_1 = require("./GeneralError");
class NotImplemented extends GeneralError_1.GeneralError {
    constructor(message) {
        super(501, 'Not Implemented', message);
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.NotImplemented = NotImplemented;
