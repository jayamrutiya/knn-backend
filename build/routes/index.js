"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const test_route_1 = __importDefault(require("./test.route"));
const customer_route_1 = __importDefault(require("./customer.route"));
exports.default = {
    testRouter: test_route_1.default,
    customerRouter: customer_route_1.default,
};
