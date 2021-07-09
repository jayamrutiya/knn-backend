"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseController_1 = __importDefault(require("./BaseController"));
class TestController extends BaseController_1.default {
    testMethod(req, res) {
        this.sendJSONResponse(res, null, {
            length: 1,
        }, {
            name: 'Test',
        });
    }
}
exports.default = TestController;
