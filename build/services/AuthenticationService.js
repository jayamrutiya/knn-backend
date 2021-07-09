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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationService = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../config/types");
const BadRequest_1 = require("../errors/BadRequest");
const crypto_1 = __importDefault(require("crypto"));
const env_1 = __importDefault(require("../config/env"));
const NotFound_1 = require("../errors/NotFound");
let AuthenticationService = class AuthenticationService {
    constructor(loggerService, jwtService, userRepository, roleRepository) {
        this._loggerService = loggerService;
        this._jwtService = jwtService;
        this._userRepository = userRepository;
        this._roleRepository = roleRepository;
        this._loggerService.getLogger().info(`Creating: ${this.constructor.name}`);
    }
    async doLogin(userName, password) {
        const user = await this._userRepository.getUserByUserName(userName);
        if (user === null) {
            throw new NotFound_1.NotFound(`User not found with userName ${userName}`);
        }
        if (user.isSuspended) {
            throw new BadRequest_1.BadRequest('User is suspended.');
        }
        const newHash = crypto_1.default
            .pbkdf2Sync(password, user.salt, 1000, 64, 'sha512')
            .toString('hex');
        if (newHash !== user.password) {
            throw new BadRequest_1.BadRequest('Invalid username or password provided.');
        }
        await this._userRepository.setLastLogin(user.id);
        const userRole = await this._roleRepository.getUserRole(user.id);
        const accessToken = this._jwtService.generateToken(userRole, env_1.default.ACCESS_TOKEN_SECRET, env_1.default.ACCESS_TOKEN_EXPIRES_IN);
        // Create a Refresh token
        const refreshToken = this._jwtService.generateToken(userRole, env_1.default.REFRESH_TOKEN_SECRET, env_1.default.REFRESH_TOKEN_EXPIRES_IN);
        await this._userRepository.storeRefreshToken(user.id, refreshToken);
        // Return token
        return { accessToken, refreshToken };
    }
    async refreshToken(userId, refreshToken) {
        const token = await this._userRepository.getRereshToken(userId, refreshToken);
        if (!token) {
            throw new BadRequest_1.BadRequest('Invalid refresh token provided.');
        }
        const userRole = await this._roleRepository.getUserRole(userId);
        const user = (await this._jwtService.verifyToken(refreshToken, env_1.default.REFRESH_TOKEN_SECRET));
        console.log(typeof user.id, typeof userId);
        if (user.id !== userId) {
            throw new BadRequest_1.BadRequest('Invalid user found.');
        }
        // Create a JWT token
        const accessToken = this._jwtService.generateToken(userRole, env_1.default.ACCESS_TOKEN_SECRET, env_1.default.ACCESS_TOKEN_EXPIRES_IN);
        return accessToken;
    }
};
AuthenticationService = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.LoggerService)),
    __param(1, inversify_1.inject(types_1.TYPES.JwtService)),
    __param(2, inversify_1.inject(types_1.TYPES.UserRepository)),
    __param(3, inversify_1.inject(types_1.TYPES.RoleRepository))
], AuthenticationService);
exports.AuthenticationService = AuthenticationService;
