"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const JSONBig = __importStar(require("json-bigint"));
const BadRequest_1 = require("../errors/BadRequest");
const GeneralError_1 = require("../errors/GeneralError");
class BaseController {
    /**
     * Sends a JSON response, using the response object
     * @param {response} res Response object
     * @param {object} metadata Metadata to send along with response
     * @param {object} data data to send
     */
    sendJSONResponse(res, message, metadata, data) {
        const response = {
            code: 200,
            status: 'OK',
            message,
        };
        if (metadata) {
            response.metadata = metadata;
        }
        response.data = data;
        return res
            .status(200)
            .contentType('application/json;charset=utf-8')
            .send(JSONBig.stringify(response));
    }
    /**
     * Send a JSON formated error response
     * @param req Request object
     * @param res Response object
     * @param error error object
     */
    sendErrorResponse(req, res, err) {
        if (err instanceof GeneralError_1.GeneralError) {
            return res.status(err.getCode()).json(err.toJSON());
        }
        return res.status(500).json({
            code: 500,
            status: 'Internal Server Error',
            message: err.message,
        });
    }
    /**
     * Validate Request
     */
    validateRequest(req) {
        const validation = express_validator_1.validationResult(req);
        if (!validation.isEmpty()) {
            const valsArray = express_validator_1.validationResult(req).array();
            const vals = {};
            for (let i = 0; i < valsArray.length; i += 1) {
                if (vals[valsArray[i].param] === undefined) {
                    vals[valsArray[i].param] = [valsArray[i].msg];
                }
                else {
                    vals[valsArray[i].param].push(valsArray[i].msg);
                }
            }
            throw new BadRequest_1.BadRequest('Invalid arguments passed.', vals);
        }
    }
}
exports.default = BaseController;
