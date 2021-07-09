"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const GeneralError_1 = require("../errors/GeneralError");
const errorHandler = (err, req, res) => {
    // eslint-disable-next-line no-console
    console.warn(`Caught Error for ${req.path}:`, err.message);
    if (err instanceof GeneralError_1.GeneralError) {
        return res.status(err.getCode()).json(err.toJSON());
    }
    return res.status(500).json({
        code: 500,
        status: 'Internal Server Error',
        message: err.message,
    });
};
exports.errorHandler = errorHandler;
