"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const test_route_1 = __importDefault(require("./test.route"));
const customer_route_1 = __importDefault(require("./customer.route"));
const user_route_1 = __importDefault(require("./user.route"));
const authentication_route_1 = __importDefault(require("./authentication.route"));
const subscription_route_1 = __importDefault(require("./subscription.route"));
const role_route_1 = __importDefault(require("./role.route"));
const book_route_1 = __importDefault(require("./book.route"));
exports.default = {
    testRouter: test_route_1.default,
    customerRouter: customer_route_1.default,
    userRouter: user_route_1.default,
    authenticationRouter: authentication_route_1.default,
    subscriptionRouter: subscription_route_1.default,
    rolerRouter: role_route_1.default,
    bookRouter: book_route_1.default,
};
