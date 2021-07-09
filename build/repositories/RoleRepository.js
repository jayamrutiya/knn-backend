"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleRepository = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../config/types");
const BadRequest_1 = require("../errors/BadRequest");
const InternalServerError_1 = require("../errors/InternalServerError");
const NotFound_1 = require("../errors/NotFound");
let RoleRepository = class RoleRepository {
    constructor(loggerService, databaseService) {
        this._loggerService = loggerService;
        this._databaseService = databaseService;
        this._loggerService.getLogger().info(`Creating: ${this.constructor.name}`);
    }
    async getRoleByName(roleName) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const role = await client.role.findFirst({
                where: {
                    name: roleName,
                },
            });
            if (role === null) {
                throw new NotFound_1.NotFound(`Role not found with name ${roleName}`);
            }
            return role;
        }
        catch (error) {
            console.log(error);
            this._loggerService.getLogger().error(`Error ${error}`);
            if (error instanceof NotFound_1.NotFound) {
                throw error;
            }
            throw new InternalServerError_1.InternalServerError('An error occurred while interacting with the database.');
        }
        finally {
            await this._databaseService.disconnect();
        }
    }
    async assignRoleToUser(roleId, userId) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const userRole = await client.userRole.create({
                data: {
                    roleId,
                    userId,
                },
            });
            return userRole !== null;
        }
        catch (error) {
            console.log(error);
            this._loggerService.getLogger().error(`Error ${error}`);
            throw new InternalServerError_1.InternalServerError('An error occurred while interacting with the database.');
        }
        finally {
            await this._databaseService.disconnect();
        }
    }
    async getUserRole(userId) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const userRole = await client.user.findFirst({
                where: {
                    id: userId,
                },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    mobileNumber: true,
                    password: false,
                    userName: false,
                    salt: false,
                    address: false,
                    city: false,
                    street: false,
                    isSuspended: false,
                    lastLoginAt: false,
                    lastLogoutAt: false,
                    createdAt: false,
                    updatedAt: false,
                    deletedAt: false,
                    UserRole: {
                        select: {
                            id: true,
                            Role: {
                                select: {
                                    name: true,
                                },
                            },
                        },
                    },
                },
            });
            if (!userRole) {
                throw new BadRequest_1.BadRequest('Invalid user id provided.');
            }
            const role = {
                id: userRole.UserRole[0].id,
                firstName: userRole.firstName,
                lastName: userRole.lastName,
                mobileNumber: userRole.mobileNumber,
                Role: userRole.UserRole[0].Role.name,
            };
            return role;
        }
        catch (error) {
            console.log(error);
            this._loggerService.getLogger().error(`Error ${error}`);
            if (error instanceof BadRequest_1.BadRequest) {
                throw error;
            }
            throw new InternalServerError_1.InternalServerError('An error occurred while interacting with the database.');
        }
        finally {
            await this._databaseService.disconnect();
        }
    }
    async updateUserRoler(roleId, id) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const userRole = await client.userRole.update({
                where: {
                    id,
                },
                data: {
                    roleId,
                },
            });
            return userRole !== null;
        }
        catch (error) {
            console.log(error);
            this._loggerService.getLogger().error(`Error ${error}`);
            throw new InternalServerError_1.InternalServerError('An error occurred while interacting with the database.');
        }
        finally {
            await this._databaseService.disconnect();
        }
    }
};
RoleRepository = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.LoggerService)),
    __param(1, inversify_1.inject(types_1.TYPES.DatabaseService))
], RoleRepository);
exports.RoleRepository = RoleRepository;
