"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseController_1 = __importDefault(require("./BaseController"));
const inversify_1 = require("inversify");
const BadRequest_1 = require("../errors/BadRequest");
let AuthenticationController = class AuthenticationController extends BaseController_1.default {
    constructor(loggerService, authenticationService) {
        super();
        this._loggerService = loggerService;
        this._authenticationService = authenticationService;
        this._loggerService.getLogger().info(`Creating : ${this.constructor.name}`);
    }
    async doLogin(req, res) {
        try {
            console.log('in auth controller');
            // validate input
            this.validateRequest(req);
            // Get parameters
            const { userName, password } = req.body;
            // verify login
            const verifiedLogin = await this._authenticationService.doLogin(userName, password);
            // send response
            this.sendJSONResponse(res, 'Logged in successfully!', { size: 1 }, verifiedLogin);
        }
        catch (error) {
            this.sendErrorResponse(req, res, error);
        }
    }
    async refreshToken(req, res) {
        try {
            // validate request
            this.validateRequest(req);
            // Get the parameters
            const { userId, refreshToken } = req.body;
            // New token
            const token = await this._authenticationService.refreshToken(BigInt(userId), refreshToken);
            // Send the response
            this.sendJSONResponse(res, null, { size: 1 }, { token });
        }
        catch (error) {
            if (error instanceof SyntaxError) {
                throw new BadRequest_1.BadRequest('Invalid request parameters found.');
            }
            this.sendErrorResponse(req, res, error);
        }
    }
};
AuthenticationController = __decorate([
    inversify_1.injectable()
], AuthenticationController);
exports.default = AuthenticationController;
