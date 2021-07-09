"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Unauthorized = void 0;
const GeneralError_1 = require("./GeneralError");
class Unauthorized extends GeneralError_1.GeneralError {
    constructor(message) {
        super(401, 'Unauthorized', message);
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.Unauthorized = Unauthorized;
