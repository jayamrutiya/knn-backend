"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Forbidden = void 0;
const GeneralError_1 = require("./GeneralError");
class Forbidden extends GeneralError_1.GeneralError {
    constructor(message) {
        super(403, 'Forbidden', message);
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.Forbidden = Forbidden;
