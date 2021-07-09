"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ts_mockery_1 = require("ts-mockery");
const types_1 = require("../../config/types");
const container_1 = require("../../config/container");
const UserController_1 = __importDefault(require("../UserController"));
const email_validator_1 = __importDefault(require("../../validators/email.validator"));
const testExpressValidatorMiddleware = async (req, res, middlewares) => {
    await Promise.all(middlewares.map(async (middleware) => {
        await middleware(req, res, () => undefined);
    }));
};
describe('authentication and authorization', () => {
    const loggerService = container_1.iocContainer.get(types_1.TYPES.LoggerService);
    const userService = container_1.iocContainer.get(types_1.TYPES.UserService);
    let userController;
    let res;
    beforeAll(() => {
        userController = new UserController_1.default(loggerService, userService);
        res = ts_mockery_1.Mock.of();
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        res.contentType = jest.fn().mockReturnValue(res);
        res.send = jest.fn().mockReturnValue(res);
    });
    // Check the if email exists API
    describe('check if email exists', () => {
        test('gives 400 Bad Request on invalid email id', async () => {
            const req = ts_mockery_1.Mock.of({
                query: {
                    emailId: 'testtest.com',
                },
            });
            await testExpressValidatorMiddleware(req, res, email_validator_1.default);
            await userController.doesEmailExist(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
        });
        test('gives 200 OK on valid email id', async () => {
            const req = ts_mockery_1.Mock.of({
                query: {
                    emailId: 'test@test.com',
                },
            });
            await testExpressValidatorMiddleware(req, res, email_validator_1.default);
            await userController.doesEmailExist(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });
});
