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
let RoleController = class RoleController extends BaseController_1.default {
    constructor(loggerService, roleService) {
        super();
        this._loggerService = loggerService;
        this._roleService = roleService;
        this._loggerService.getLogger().info(`Creating : ${this.constructor.name}`);
    }
    async getUserRole(req, res) {
        try {
            // TODO: validate parameters
            const userId = BigInt(req.params.id);
            const role = await this._roleService.getUserRole(userId);
            // Return response
            return this.sendJSONResponse(res, 'User Role', {
                length: 1,
            }, role);
        }
        catch (error) {
            console.log(error);
            return this.sendErrorResponse(req, res, error);
        }
    }
};
RoleController = __decorate([
    inversify_1.injectable()
], RoleController);
exports.default = RoleController;
